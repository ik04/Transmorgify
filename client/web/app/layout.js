import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Transmorgify",
  description: "A simple yt to mp3 converter",
  openGraph: {
    images: [
      {
        url: "https://transmorgify.vercel.app/assets/meta.png",
        width: 800,
        height: 800,
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta name="description" content="A simple yt to mp3 converter" />

        <meta property="og:url" content="https://transmorgify.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Transmorgify" />
        <meta
          property="og:description"
          content="A simple yt to mp3 converter"
        />
        <meta
          property="og:image"
          content="https://transmorgify.vercel.app/assets/meta.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="transmorgify.vercel.app" />
        <meta
          property="twitter:url"
          content="https://transmorgify.vercel.app"
        />
        <meta name="twitter:title" content="Transmorgify" />
        <meta
          name="twitter:description"
          content="A simple yt to mp3 converter"
        />
        <meta
          name="twitter:image"
          content="https://transmorgify.vercel.app/assets/meta.png"
        />
      </Head>
      <body className={inter.className}>
        <Toaster
          position="top-center"
          toastOptions={{
            unstyled: true,
            classNames: {
              error:
                "text-mediumSlateBlue flex items-center space-x-2 justify-center",
              warning:
                "text-mediumSlateBlue flex items-center space-x-2 justify-center",
              success:
                "text-heliotrope flex items-center space-x-2 justify-center",
              loading:
                "text-heliotrope flex items-center space-x-2 justify-center",
              info: "text-mediumSlateBlue flex items-center space-x-2 justify-center",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
