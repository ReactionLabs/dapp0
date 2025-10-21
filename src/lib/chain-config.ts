export type ChainType = 'solana' | 'ethereum' | 'sui' | 'xrp' | 'polygon' | 'avalanche'

export interface ChainConfig {
  id: ChainType
  name: string
  symbol: string
  rpcUrl: string
  testnetRpcUrl: string
  explorerUrl: string
  testnetExplorerUrl: string
  color: string
  icon: string
  language: string
  framework: string
  walletRequired: boolean
}

export const CHAIN_CONFIGS: Record<ChainType, ChainConfig> = {
  solana: {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    testnetRpcUrl: 'https://api.devnet.solana.com',
    explorerUrl: 'https://explorer.solana.com',
    testnetExplorerUrl: 'https://explorer.solana.com/?cluster=devnet',
    color: '#9945FF',
    icon: '🟣',
    language: 'Rust',
    framework: 'Anchor',
    walletRequired: true,
  },
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
    testnetRpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/',
    explorerUrl: 'https://etherscan.io',
    testnetExplorerUrl: 'https://sepolia.etherscan.io',
    color: '#627EEA',
    icon: '🔷',
    language: 'Solidity',
    framework: 'Foundry',
    walletRequired: true,
  },
  sui: {
    id: 'sui',
    name: 'Sui',
    symbol: 'SUI',
    rpcUrl: 'https://fullnode.mainnet.sui.io:443',
    testnetRpcUrl: 'https://fullnode.testnet.sui.io:443',
    explorerUrl: 'https://suiexplorer.com',
    testnetExplorerUrl: 'https://suiexplorer.com/?network=testnet',
    color: '#4FA8FF',
    icon: '🔵',
    language: 'Move',
    framework: 'Sui CLI',
    walletRequired: true,
  },
  xrp: {
    id: 'xrp',
    name: 'XRP Ledger',
    symbol: 'XRP',
    rpcUrl: 'wss://xrplcluster.com',
    testnetRpcUrl: 'wss://s.altnet.rippletest.net:51233',
    explorerUrl: 'https://xrpscan.com',
    testnetExplorerUrl: 'https://testnet.xrpscan.com',
    color: '#23292F',
    icon: '💧',
    language: 'JavaScript',
    framework: 'xrpl.js',
    walletRequired: false,
  },
  polygon: {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com',
    testnetRpcUrl: 'https://rpc-mumbai.maticvigil.com',
    explorerUrl: 'https://polygonscan.com',
    testnetExplorerUrl: 'https://mumbai.polygonscan.com',
    color: '#8247E5',
    icon: '🟣',
    language: 'Solidity',
    framework: 'Foundry',
    walletRequired: true,
  },
  avalanche: {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    testnetRpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorerUrl: 'https://snowtrace.io',
    testnetExplorerUrl: 'https://testnet.snowtrace.io',
    color: '#E84142',
    icon: '🔴',
    language: 'Solidity',
    framework: 'Foundry',
    walletRequired: true,
  },
}

export const SUPPORTED_CHAINS: ChainType[] = ['solana', 'ethereum', 'sui', 'xrp']

export const getChainConfig = (chainId: ChainType): ChainConfig => {
  return CHAIN_CONFIGS[chainId]
}

export const getChainIcon = (chainId: ChainType): string => {
  return CHAIN_CONFIGS[chainId].icon
}

export const getChainColor = (chainId: ChainType): string => {
  return CHAIN_CONFIGS[chainId].color
}

