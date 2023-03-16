import FetchButton from "@/components/FetchButton";
import AssetContainer from "@/components/AssetContainer";
import styles from "@/styles/Home.module.scss";
import { Stack } from "@mui/material";
import { Paper } from "@mui/material";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import { MouseEventHandler, useState } from "react";
import { Assessment } from "@mui/icons-material";

type stock = {
  acquisition_price: number;
  current_price: number;
  shares_held: number;
  stock_code: string;
  stock_name: string;
  stock_type: string;
  valuation: number;
};

type assets_held = {
  stocks: Array<stock>;
  total_assets: number;
};

type responce = {
  assets_held: assets_held;
};

export default function Home() {
  const [assets, setAssets] = useState({
    stocks: [],
    total_assets: 0,
  } as assets_held);

  const fetchAssets: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    await fetch("/api/sbi/assets", {
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
        setAssets(latest_assets);
      });
  };

  const updateAssets = (latest_assets_info: responce) => {
    setAssets(latest_assets_info.assets_held);
  };

  return (
    <>
      <div className={styles.main}>
        <FetchButton
          variant="contained"
          label="資産を更新"
          onClick={fetchAssets}
        />
        <div>
          <div className={styles.title}>
            <span>総資産</span>
          </div>
          <Box className={styles.box}>
            <Paper elevation={3} className={styles.paper}>
              <div className={styles.money}>
                <span>{assets.total_assets.toLocaleString()}</span>
                <span>円</span>
              </div>
            </Paper>
          </Box>
        </div>
        <AssetContainer stocks={assets.stocks}></AssetContainer>
      </div>
    </>
  );
}
