import "../styles/globals.css";
import NProgress from "nprogress";
import type { AppContext, AppInitialProps, AppProps } from "next/app";
import Router from "next/router";
import { Page } from "../components/layout/index-page";
import "../styles/nprogress.css";
import { ApolloProvider } from "@apollo/client";
import withData from "../lib/with-data";
import App from "next/app";

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

interface MyAppProps extends AppProps {
  apollo?: any;
}

function MyApp({ Component, pageProps, apollo }: MyAppProps) {
  return (
    <ApolloProvider client={apollo}>
      <Page>
        <Component {...pageProps} />
      </Page>
    </ApolloProvider>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }: AppContext): Promise<AppInitialProps> => {
  let pageProps: any = {}
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query;
  return { pageProps };
};

const MainApp = MyApp as unknown as typeof App

export default withData(MainApp);
