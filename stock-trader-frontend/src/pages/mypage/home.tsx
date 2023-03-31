import FetchButton from "@/components/FetchButton";
import AssetContainer from "@/components/AssetContainer";
import styles from "@/styles/Home.module.scss";
import {
  MouseEventHandler,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Chart } from "react-google-charts";
import Header from "@/components/Header";
import RefreshButton from "@/components/RefreshButton";
import { loading } from "../_app";
import { Box } from "@mui/system";

type stock = {
  acquisition_price: number;
  current_price: number;
  shares_held: number;
  stock_code: string;
  stock_name: string;
  stock_type: string;
};

type assets_held = {
  total_assets_details: Array<stock>;
  total_assets: number;
};

export default function Home() {
  const { isLoading, setIsLoading } = useContext(loading);
  const [data, setData] = useState([[]]);
  const [assets, setAssets] = useState({
    total_assets_details: [],
    total_assets: 0,
  } as assets_held);

  const fetchLatestAssets = async () => {
    setIsLoading(true);

    await fetch("/api/sbi/latest/assets", {
      method: "POST",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((latest_assets) => {
        if (!latest_assets) {
          return;
        }
        setAssets(latest_assets[0]);
        setData([
          ["期間", "総資産"],
          ...latest_assets
            .sort((a, b) => (a.created_at > b.created_at ? 1 : -1))
            .map((la) => [
              new Date(la.created_at).toLocaleDateString("YYYYMMDD"),
              la.total_assets,
            ]),
        ]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useLayoutEffect(() => {
    fetchLatestAssets();
  }, []);

  const updateAssets: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    await fetch("/api/sbi/update/assets", {
      method: "POST",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((latest_assets) => {
        if (!latest_assets) {
          return;
        }
        fetchLatestAssets();
      });
  };

  return (
    <>
      <Header node={<RefreshButton onClick={updateAssets} />}></Header>
      <Box display="flex" justifyContent="center" justifyItems="center">
        <Chart
          chartType="LineChart"
          data={data}
          width="100%"
          height="400px"
          legendToggle
          options={{
            title: "資産推移",
            curveType: "function",
            backgroundColor: "transparent",
          }}
        />
      </Box>
      <div className={styles.main}>
        <AssetContainer stocks={assets.total_assets_details}></AssetContainer>
      </div>
    </>
  );
}
