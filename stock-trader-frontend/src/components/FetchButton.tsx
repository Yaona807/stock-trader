import Button from "@mui/material/Button";
import { Box, CircularProgress } from "@mui/material";
import React, { EventHandler, MouseEventHandler } from "react";
import { useState } from "react";
import { resolve } from "path";
import { useRouter } from "next/router";
import { LoadingButton } from "@mui/lab";

interface props {
  startIcon: React.ReactNode;
  variant: "text" | "contained" | "outlined";
  label: string;
  onClick: Function;
}

const FetchButton = (props: props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { startIcon, variant, label, onClick } = props;
  const router = useRouter();

  const clickFetchButton: MouseEventHandler<HTMLButtonElement> = async (e) => {
    if (isLoading) return;

    setIsLoading(true);
    await onClick(e);
    await setIsLoading(false);
  };

  return (
    <LoadingButton
      startIcon={startIcon}
      loading={isLoading}
      loadingPosition="start"
      variant={variant}
      onClick={clickFetchButton}
    >
      <Box component="span">{label}</Box>
    </LoadingButton>
  );
};

export default FetchButton;
