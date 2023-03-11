import { Grid, Stack } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";
import { Box } from "@mui/system";
import Link from "next/link";

export default function Registration() {
  const { register, handleSubmit } = useForm<any>();
  const router = useRouter();

  const onSubmit: SubmitHandler<any> = async (data) => {
    const res = await fetch("/api/auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      method: "POST",
    });

    if (res.ok) {
      router.push("/mypage/home");
    }
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      height="100vh"
    >
      <Box textAlign="center" width="350px" fontSize="35px">
        新規登録
      </Box>
      <Stack
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={2}
        method="post"
        sx={{ m: 2, width: "350px" }}
      >
        <TextField
          label="ID"
          type="text"
          variant="outlined"
          {...register("user_id")}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          {...register("user_password")}
        />
        <Button variant="contained" type="submit">
          新規登録する
        </Button>
      </Stack>
      <Box textAlign="center" width="350px" fontSize="15px">
        ログインする場合は<Link href="/login">こちら</Link>から
      </Box>
    </Grid>
  );
}
