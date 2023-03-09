import FetchButton from "@/components/FetchButton";
import AssetContainer from "@/components/AssetContainer";
import styles from "@/styles/Home.module.scss";
import { Stack } from "@mui/material";
import { Paper } from "@mui/material";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Typography } from "@mui/material";
import { useState } from "react";
import { Assessment } from "@mui/icons-material";

type stock = {
  acquisition_price: number;
  current_price: number;
  shares_held_number: number;
  stock_code: string;
  stock_name: string;
  type: string;
  valuation: number;
};

type assets_held = {
  all_investment_trust_value: number;
  all_stock_list: Array<stock>;
  all_stock_value: number;
  cash: number;
};

type responce = {
  assets_held: assets_held;
};

export default function Home() {
  const [assets, setAssets] = useState({
    all_investment_trust_value: 0,
    all_stock_list: [],
    all_stock_value: 0,
    cash: 0,
  } as assets_held);

  const updateAssets = (latest_assets_info: responce) => {
    setAssets(latest_assets_info.assets_held);
  };

  return (
    <>
      <div className={styles.main}>
        <FetchButton
          variant="contained"
          fetch_url={new URL("http://localhost:3000/api/auth/logout")}
          label="ログイン"
          callback={updateAssets}
        />
        <div>
          <div className={styles.title}>
            <span>総資産</span>
          </div>
          <Box className={styles.box}>
            <Paper elevation={3} className={styles.paper}>
              <div className={styles.money}>
                <span>
                  {(
                    assets.all_stock_value +
                    assets.all_investment_trust_value +
                    assets.cash
                  ).toLocaleString()}
                </span>
                <span>円</span>
              </div>
            </Paper>
          </Box>
        </div>
        <AssetContainer assets={assets}></AssetContainer>
      </div>
    </>
  );
}
