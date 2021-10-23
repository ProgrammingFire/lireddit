import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { AppProps } from "next/app";
import React from "react";
import Navbar from "../components/Navbar";
import theme from "../theme";
import { createUrqlClient } from "../utils/createUrqlClient";
import Head from "next/head";
import "../css/styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <ColorModeProvider options={theme}>
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default MyApp;
