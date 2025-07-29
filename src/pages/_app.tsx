import "../styles/globals.css";
import Layout from "../components/Layout";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const noLayoutPaths = ["/login", "/signup"];

  const isNoLayoutPage = noLayoutPaths.includes(router.pathname);

  return (
    <>
      {isNoLayoutPage ? (
        // Render only the component for login/signup pages without Layout
        <Component {...pageProps} />
      ) : (
        // Apply Layout for other pages (e.g., Dashboard)
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </>
  );
}
