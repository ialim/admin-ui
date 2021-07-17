import "../styles/globals.css";
import NProgress from "nprogress";
import type { AppProps } from "next/app";
import Router from "next/router";
import { Page } from "../layout/index-page";
import "../styles/nprogress.css";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Page>
      <Component {...pageProps} />
    </Page>
  );
}
export default MyApp;
