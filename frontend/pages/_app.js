import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import { useEffect } from "react";
import { setAuthToken } from "../utils/auth";
import { httpClient } from "../utils/httpClient";
import { StorageMonitorProvider, AutoStorageManager } from "../components/StorageMonitorProvider";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Check for token and set auth header
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        setAuthToken(token);
      }
    }

    // Log the base URL for debugging
    console.log("API Base URL:", process.env.BACKEND_API_URL);
  }, []);

  return (
    <StorageMonitorProvider threshold={75} checkInterval={120000}>
      <Head>
        <title>Com Financial Services</title>
        <meta
          name="description"
          content="Professional financial services including tax filing, GST registration, company incorporation, and financial auditing."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg" />
      </Head>

      <Toaster position="top-right" />
      
      {/* Auto storage management to prevent quota errors */}
      {typeof window !== "undefined" && <AutoStorageManager />}

      <Component {...pageProps} />
    </StorageMonitorProvider>
  );
}

export default MyApp;
