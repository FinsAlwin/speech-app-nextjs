import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Inter } from "@next/font/google";
import "bootstrap/dist/css/bootstrap.css";
import { ToastContainer } from "react-toastify";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <ToastContainer />
      <main className={inter.className}>
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}
