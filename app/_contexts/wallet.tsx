import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider as DappProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { lightTheme } from "@/styles/wallet-theme";
interface Props {
  children: React.ReactNode;
}
// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

export const WalletProvider: React.FC<Props> = ({ children }) => {
  return (
    <SuiClientProvider networks={networkConfig} defaultNetwork="mainnet">
      <DappProvider theme={lightTheme}>{children}</DappProvider>
    </SuiClientProvider>
  );
};
