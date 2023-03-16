import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import { EventHandler, MouseEventHandler } from "react";
import { useState } from "react";
import { resolve } from "path";
import { useRouter } from "next/router";

interface props {
  variant: "text" | "contained" | "outlined";
  label: string;
  onClick: Function;
}

const FetchButton = (props: props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { variant, label, onClick } = props;
  const router = useRouter();

  const clickFetchButton: MouseEventHandler<HTMLButtonElement> = async (e) => {
    if (isLoading) return;

    setIsLoading(true);
    await onClick(e);
    await setIsLoading(false);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Button variant={variant} onClick={clickFetchButton}>
      {label}
    </Button>
  );
};

export default FetchButton;
