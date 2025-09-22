import "@/styles/globals.css";
import { ThemeProvider } from "next-themes";
import { ToastProvider } from "@/components/ui/toast-provider";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </ThemeProvider>
  );
}
