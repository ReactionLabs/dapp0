import { ChainType } from './chain-config'

export interface V0GenerationRequest {
  prompt: string
  type: 'frontend' | 'agent'
  chain: ChainType
}

export interface V0GenerationResponse {
  success: boolean
  code: string
  chain: ChainType
  timestamp: string
  error?: string
}

export class V0Integration {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
    this.baseUrl = 'https://mcp.v0.dev'
  }

  async generateCode(request: V0GenerationRequest): Promise<V0GenerationResponse> {
    try {
      // Enhanced prompt with chain-specific context
      const enhancedPrompt = this.buildEnhancedPrompt(request)
      
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: enhancedPrompt,
          chain: request.chain,
          type: request.type,
        }),
      })

      if (!response.ok) {
        throw new Error(`v0 API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      return {
        success: true,
        code: data.code,
        chain: request.chain,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error('v0 generation error:', error)
      return {
        success: false,
        code: '',
        chain: request.chain,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  private buildEnhancedPrompt(request: V0GenerationRequest): string {
    const { prompt, type, chain } = request
    
    const chainContext = this.getChainContext(chain)
    const typeContext = this.getTypeContext(type, chain)
    
    return `${typeContext}

Chain: ${chainContext.name} (${chainContext.language})
Framework: ${chainContext.framework}

User Request: ${prompt}

Requirements:
- Generate ${type} code for ${chainContext.name}
- Use ${chainContext.language} programming language
- Include proper wallet integration for ${chainContext.name}
- Add necessary imports and dependencies
- Include error handling and best practices
- Make the code production-ready
- Add comments explaining the functionality

Please generate the complete, working code:`
  }

  private getChainContext(chain: ChainType) {
    const contexts = {
      solana: {
        name: 'Solana',
        language: 'Rust/TypeScript',
        framework: 'Anchor',
        wallet: 'Phantom/Solflare',
        features: 'high-speed transactions, low fees, NFT support'
      },
      ethereum: {
        name: 'Ethereum',
        language: 'Solidity/TypeScript',
        framework: 'Foundry/Hardhat',
        wallet: 'MetaMask',
        features: 'smart contracts, DeFi, ERC standards'
      },
      sui: {
        name: 'Sui',
        language: 'Move/TypeScript',
        framework: 'Sui CLI',
        wallet: 'Sui Wallet',
        features: 'object-oriented, parallel execution, gas optimization'
      },
      xrp: {
        name: 'XRP Ledger',
        language: 'JavaScript',
        framework: 'xrpl.js',
        wallet: 'XRP Wallet',
        features: 'fast payments, low fees, built-in DEX'
      },
      polygon: {
        name: 'Polygon',
        language: 'Solidity/TypeScript',
        framework: 'Foundry/Hardhat',
        wallet: 'MetaMask',
        features: 'EVM compatible, low fees, fast transactions'
      },
      avalanche: {
        name: 'Avalanche',
        language: 'Solidity/TypeScript',
        framework: 'Foundry/Hardhat',
        wallet: 'MetaMask',
        features: 'EVM compatible, subnets, high throughput'
      }
    }
    
    return contexts[chain]
  }

  private getTypeContext(type: 'frontend' | 'agent', chain: ChainType): string {
    if (type === 'frontend') {
      return `Generate a React frontend component for a ${chain} dApp with the following features:
- Modern UI with Tailwind CSS
- Wallet connection functionality
- Responsive design
- Error handling
- Loading states
- TypeScript support`
    } else {
      return `Generate an AI agent/smart contract for ${chain} with the following features:
- On-chain logic implementation
- Security best practices
- Event emission
- Access control
- Gas optimization
- Comprehensive documentation`
    }
  }
}

// Get API key from localStorage or environment
const getApiKey = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('v0_api_key') || process.env.V0_API_KEY || ''
  }
  return process.env.V0_API_KEY || ''
}

// Export a singleton instance
export const v0Integration = new V0Integration(getApiKey())
