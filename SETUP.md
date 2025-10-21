# dApp0 Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up your v0 API key:**
   - Get your API key from [v0.dev](https://v0.dev)
   - Open the app and click "Settings" in the sidebar
   - Enter your v0 API key and click "Save"

3. **Start the development server:**
   ```bash
   pnpm dev
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - Connect your Solana wallet
   - Start building!

## Environment Variables (Optional)

Create a `.env.local` file in the root directory:

```env
# v0 API Configuration
V0_API_KEY=your_v0_api_key_here

# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Multi-chain API Keys (Optional)
MORALIS_API_KEY=your_moralis_api_key_here
ALCHEMY_API_KEY=your_alchemy_api_key_here
SUI_RPC_URL=https://fullnode.testnet.sui.io:443
XRP_RPC_URL=wss://s.altnet.rippletest.net:51233
```

## Features

### ✅ Multi-Chain Support
- **Solana**: Rust/Anchor programs with Phantom/Solflare wallets
- **Ethereum**: Solidity contracts with MetaMask integration
- **Sui**: Move modules with Sui wallet support
- **XRP Ledger**: JavaScript with xrpl.js integration
- **Polygon**: EVM-compatible Solidity contracts
- **Avalanche**: EVM-compatible with high throughput

### ✅ AI-Powered Generation
- Real v0 MCP server integration
- Chain-specific code generation
- Natural language prompts
- Fallback mock generation

### ✅ Project Management
- Save and manage projects
- LocalStorage persistence
- Project history and versions
- Export and deployment options

## Usage Examples

### Frontend Generation
```
Prompt: "Create a Solana NFT minter with wallet connect"
Chain: Solana
Result: React component with Solana wallet integration
```

### Agent Creation
```
Prompt: "Build an Ethereum DeFi yield farming agent"
Chain: Ethereum
Result: Solidity smart contract with yield farming logic
```

### Multi-Chain Projects
```
Prompt: "Create a cross-chain token bridge agent"
Chain: Multiple chains supported
Result: Chain-specific implementations
```

## Troubleshooting

### v0 API Issues
- Ensure your API key is valid and active
- Check the Settings modal for validation status
- Try the fallback mock generation if v0 fails

### Wallet Connection Issues
- Make sure you have a Solana wallet installed (Phantom, Solflare)
- Check that you're on the correct network (devnet for testing)
- Refresh the page if connection fails

### Code Generation Issues
- Try simpler prompts first
- Check the browser console for errors
- Ensure the selected chain matches your intent

## Development

### Adding New Chains
1. Update `src/lib/chain-config.ts`
2. Add chain-specific code generation in `src/app/api/generate/route.ts`
3. Update the chain selector component

### Customizing Generation
1. Modify `src/lib/v0-integration.ts`
2. Update prompt templates for better results
3. Add chain-specific context and requirements

## Support

- Check the browser console for detailed error messages
- Ensure all dependencies are installed correctly
- Verify your v0 API key is working
- Test with different chains and prompts

Happy building! 🚀

