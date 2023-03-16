import { Paper } from "@mui/material";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";

const isInvestmentTrust = (stock_type: string) => {
  return /投資信託/.test(stock_type);
};

const formatNumberForRendering = (num: number) => {
  if (num > 0) {
    return (
      <Box component="span" color="red">
        {"+" + num}
      </Box>
    );
  }
  if (num < 0) {
    return (
      <Box component="span" color="blue">
        {num}
      </Box>
    );
  }

  return <Box component="span">{num}</Box>;
};

const renderValuation = (stock: any) => {
  const valuation: number = (() => {
    const valuation =
      (stock.current_price - stock.acquisition_price) * stock.shares_held;

    if (isInvestmentTrust(stock.stock_type)) {
      return Math.round(valuation / 10000);
    }

    return valuation;
  })();

  return (
    <Box display="flex" justifyContent="flex-end">
      <Box component="span">{"含み益 "}</Box>
      {formatNumberForRendering(valuation)}
    </Box>
  );
};

const renderStockName = (stock_name: string, stock_code?: string) => {
  return (
    <Box
      sx={{
        marginTop: "5px",
        marginBottom: "5px",
      }}
    >
      {stock_code && (
        <Box component="span" sx={{ paddingRight: "5px", color: "#8b8b8b" }}>
          {stock_code}
        </Box>
      )}
      <Box
        sx={{
          fontSize: "20px",
          fontWeight: "bold",
        }}
        component="span"
      >
        {stock_name}
      </Box>
    </Box>
  );
};

const AssetContainer = (props: any) => {
  const { stocks } = props;

  return (
    <Grid container spacing={2} justifyContent="center" justifyItems="center">
      {stocks.map((stock, index) => (
        <Grid key={index} item xs={12}>
          <Paper elevation={3} sx={{ padding: "16px" }}>
            <Box display="flex" justifyContent="space-between">
              <Box>{stock.stock_type}</Box>
              <Box>{"現在価格 " + stock.current_price}</Box>
            </Box>
            {renderStockName(stock.stock_name)}
            <Box>
              {"平均取得単価 " + stock.acquisition_price + "円"}
              {" × " + stock.shares_held + "株"}
            </Box>
            {renderValuation(stock)}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default AssetContainer;
