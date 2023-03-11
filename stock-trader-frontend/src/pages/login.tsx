import { Stack } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/router";

export default function Login() {
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
    <>
      <Stack
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        spacing={2}
        method="post"
        sx={{ m: 2, width: "25ch" }}
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
          ログイン
        </Button>
      </Stack>
    </>
  );
}
