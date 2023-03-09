import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import { EventHandler, MouseEventHandler } from "react";
import { useState } from "react";
import { resolve } from "path";
import { useRouter } from "next/router";

interface props {
  variant: "text" | "contained" | "outlined";
  fetch_url: URL;
  label: string;
  callback: Function;
}

const FetchButton = (props: props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const clickFetchButton: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (isLoading) return;

    e.preventDefault();
    setIsLoading(true);

    fetch(props.fetch_url, {
      method: "POST",
    }).then(() => {
      router.push('/login');
    });
    setIsLoading(false);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Button variant={props.variant} onClick={clickFetchButton}>
      {props.label}
    </Button>
  );
};

export default FetchButton;
