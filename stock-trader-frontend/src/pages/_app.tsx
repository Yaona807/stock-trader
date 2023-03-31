import Loading from "@/components/Loading";
import "@/styles/globals.scss";
import type { AppProps } from "next/app";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export const loading = createContext(
  {} as {
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
  }
);

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <loading.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <Loading />}
      <Component {...pageProps} />
    </loading.Provider>
  );
}
