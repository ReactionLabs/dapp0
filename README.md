# dApp0 - V0 for Solana

A V0-style platform for building Solana dApps and AI agents with natural language prompts.

## Features

- 🎨 **Frontend Generation**: Create React components with Solana wallet integration
- 🤖 **AI Agent Creation**: Build on-chain autonomous agents
- 💼 **Project Management**: Save and manage your generated projects
- 🔗 **Wallet Integration**: Connect with Phantom, Solflare, and other Solana wallets
- 🚀 **Live Preview**: See your generated code in real-time
- 📱 **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Radix UI, Lucide Icons
- **Blockchain**: Solana Web3.js, Anchor, Wallet Adapter
- **AI**: v0 MCP Server integration (planned)
- **Storage**: LocalStorage (with plans for on-chain storage)

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Solana wallet (Phantom, Solflare, etc.)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd dapp0
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Start the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Creating a Frontend Project

1. Click "New Project" in the sidebar
2. Select "Frontend" mode
3. Describe your UI in natural language (e.g., "Build a Solana NFT minter UI with wallet connect and mint button")
4. Click "Generate" to create the React component
5. Preview your code in the right panel
6. Download or deploy your generated code

### Creating an AI Agent

1. Click "New Project" in the sidebar
2. Select "Agent" mode
3. Describe your agent behavior (e.g., "Create an agent that monitors SOL price and swaps to USDC if it drops 5%")
4. Click "Generate" to create the Anchor program
5. Review the generated Rust code
6. Deploy to Solana devnet

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── dashboard/         # Dashboard components
│   ├── providers/         # Context providers
│   └── ui/               # Reusable UI components
└── lib/                  # Utility functions
```

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Adding New Features

1. **Frontend Generation**: Extend the API route in `src/app/api/generate/route.ts`
2. **Agent Creation**: Add Solana program templates in the generation logic
3. **UI Components**: Add new components in `src/components/ui/`
4. **Wallet Integration**: Extend wallet providers in `src/components/providers/`

## Roadmap

- [ ] v0 MCP Server integration for real AI generation
- [ ] On-chain project storage using Solana PDAs
- [ ] Agent deployment to Solana devnet/mainnet
- [ ] Template gallery with pre-built projects
- [ ] Collaboration features for multi-user editing
- [ ] Advanced agent triggers and oracles integration
- [ ] Mobile wallet support (Solana Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by [Vercel's v0](https://v0.dev)
- Built for the Solana ecosystem
- Uses [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- Powered by [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com)