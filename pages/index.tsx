import * as React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

function Account() {
  const { address, connector, isConnected } = useAccount();
  const disconnect = useDisconnect();

  return (
    <>
      <div>{address}</div>

      <div>
        <button onClick={() => disconnect.disconnect()}>Disconnect</button>
        {isConnected && connector?.name && (
          <span>Connected to {connector.name}</span>
        )}
      </div>
    </>
  );
}

function Connect() {
  const { connector, isReconnecting } = useAccount();
  const {
    connect,
    connectors,
    isLoading,
    error,
    pendingConnector
  } = useConnect();

  return (
    <>
      <div>
        {connectors.map((x) => (
          <button
            disabled={!x.ready || isReconnecting || connector?.id === x.id}
            key={x.name}
            onClick={() => connect({ connector: x })}
          >
            {x.name}
            {isLoading && x.id === pendingConnector?.id && "…"}
          </button>
        ))}
      </div>

      <div>{error && error.message}</div>
    </>
  );
}

export function useIsMounted() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
}

function Page() {
  const { isConnected } = useAccount();
  const isMounted = useIsMounted();

  if (!isMounted) return null;
  return <>{isConnected ? <Account /> : <Connect />}</>;
}

export default Page;
