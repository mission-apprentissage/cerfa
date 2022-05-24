import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width; initial-scale=1.0;" />

        <script defer data-domain={process.env.REACT_APP_BASE_HOST} src="https://plausible.io/js/plausible.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
