import { IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { MouseEventHandler, useContext, useState } from "react";
import { loading } from "@/pages/_app";

function RefreshButton(props: any) {
  const {isLoading, setIsLoading} = useContext(loading);
  const { onClick } = props;

  const clickRefreshButton: MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    if (isLoading) return;

    setIsLoading(true);
    await onClick(e);
    await setIsLoading(false);
  };

  return (
    <IconButton onClick={clickRefreshButton}>
      <RefreshIcon sx={{ color: "white" }} />
    </IconButton>
  );
}

export default RefreshButton;
