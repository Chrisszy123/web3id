// 1. Import modules.
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { WagmiProvider, deserialize, serialize } from 'wagmi'
import { createConfig, http } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { Login } from '../components/Login'
// 2. Create a new Query Client with a default `gcTime`.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 24, // 24 hours
    },
  },
})

// 3. Set up the persister.
const persister = createSyncStoragePersister({
  serialize,
  storage: window.localStorage,
  deserialize,
})

const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    injected(),
  ],
  transports: {
    [base.id]: http('https://base.llamarpc.com'),
    [baseSepolia.id]: http('https://base-sepolia.llamarpc.com'),
  },
})

export default function App() {
  return (
    <WagmiProvider config={config}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        <Login />
      </PersistQueryClientProvider>
    </WagmiProvider>
  )
}