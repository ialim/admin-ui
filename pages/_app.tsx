import "../styles/globals.css";
import NProgress from "nprogress";
import type { AppContext, AppProps } from "next/app";
import Router from "next/router";
import { Page } from "../components/layout/index-page";
import "../styles/nprogress.css";
import { ApolloProvider } from "@apollo/client";
import withData from "../lib/with-data";

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

MyApp.getInitialProps = async ({ Component, ctx }: AppContext) => {
  let pageProps: any = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query;
  return { pageProps };
};

export default withData(MyApp);
