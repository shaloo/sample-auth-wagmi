import { WagmiConfig, configureChains, createClient, Chain } from "wagmi";
import { goerli, mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { publicProvider } from "wagmi/providers/public";
import { ArcanaConnector } from "@arcana/auth-wagmi";
import { newAuthProvider } from "../utils/newArcanaAuth";

import "../styles/globals.css";
import type { AppProps } from "next/app";

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli, polygon, polygonMumbai],
  [publicProvider()],
  { targetQuorum: 1 }
);

const connectors = [
  new ArcanaConnector({
    chains,
    options: {
      auth: newAuthProvider(),
      login: {
        provider: "google",
      },
    },
  }),
  new MetaMaskConnector({
    chains,
    options: {
      shimDisconnect: true,
      UNSTABLE_shimOnConnectSelectAccount: true,
    },
  }),
  new CoinbaseWalletConnector({
    chains,
    options: { appName: "wagmi" },
  }),
  new WalletConnectConnector({
    chains,
    options: { projectId: '...'},
  }),
  new InjectedConnector({
    chains,
    options: {
      name: "Browser Wallet",
      shimDisconnect: true,
    },
  }),
];

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <Component {...pageProps} />
    </WagmiConfig>
  );
}

export default App;
