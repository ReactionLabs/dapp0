import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ChainType } from '@/lib/chain-config'
import { v0Integration } from '@/lib/v0-integration'

const GenerateRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  type: z.enum(['frontend', 'agent']),
  chain: z.enum(['solana', 'ethereum', 'sui', 'xrp', 'polygon', 'avalanche']),
  projectId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, type, chain, projectId } = GenerateRequestSchema.parse(body)

    // Use real v0 MCP server for generation
    const v0Response = await v0Integration.generateCode({
      prompt,
      type,
      chain: chain as ChainType,
    })

    if (v0Response.success) {
      return NextResponse.json({
        success: true,
        code: v0Response.code,
        chain,
        projectId: projectId || Date.now().toString(),
        timestamp: v0Response.timestamp
      })
    } else {
      // Fallback to mock code if v0 fails
      console.warn('v0 generation failed, using fallback:', v0Response.error)
      const fallbackCode = generateMockCode(prompt, type, chain as ChainType)
      
      return NextResponse.json({
        success: true,
        code: fallbackCode,
        chain,
        projectId: projectId || Date.now().toString(),
        timestamp: new Date().toISOString(),
        warning: 'Using fallback code generation'
      })
    }
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate code' },
      { status: 500 }
    )
  }
}

function generateMockCode(prompt: string, type: 'frontend' | 'agent', chain: ChainType): string {
  if (type === 'frontend') {
    return generateFrontendCode(prompt, chain)
  } else {
    return generateAgentCode(prompt, chain)
  }
}

function generateFrontendCode(prompt: string, chain: ChainType): string {
  switch (chain) {
    case 'solana':
      return `import React from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'

export default function GeneratedComponent() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Solana dApp</h1>
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
          <p className="text-gray-300 mb-4">
            Connect your Solana wallet to interact with the blockchain.
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
            Connect Wallet
          </button>
        </div>
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Generated for: ${prompt}</h2>
          <p className="text-gray-300">
            This component was generated based on your prompt and includes Solana wallet integration.
          </p>
        </div>
      </div>
    </div>
  )
}`

    case 'ethereum':
      return `import React from 'react'
import { ethers } from 'ethers'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

export default function GeneratedComponent() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Ethereum dApp</h1>
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
          <p className="text-gray-300 mb-4">
            Connect your Ethereum wallet to interact with the blockchain.
          </p>
          {isConnected ? (
            <div>
              <p className="text-green-400 mb-2">Connected: {address}</p>
              <button 
                onClick={() => disconnect()}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              onClick={() => connect({ connector: connectors[0] })}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Generated for: ${prompt}</h2>
          <p className="text-gray-300">
            This component was generated based on your prompt and includes Ethereum wallet integration.
          </p>
        </div>
      </div>
    </div>
  )
}`

    case 'sui':
      return `import React from 'react'
import { useWallet } from '@mysten/wallet-adapter-react'

export default function GeneratedComponent() {
  const { connected, connect, disconnect, wallet } = useWallet()

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Sui dApp</h1>
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
          <p className="text-gray-300 mb-4">
            Connect your Sui wallet to interact with the blockchain.
          </p>
          {connected ? (
            <div>
              <p className="text-green-400 mb-2">Connected to {wallet?.name}</p>
              <button 
                onClick={disconnect}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              onClick={() => connect()}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Generated for: ${prompt}</h2>
          <p className="text-gray-300">
            This component was generated based on your prompt and includes Sui wallet integration.
          </p>
        </div>
      </div>
    </div>
  )
}`

    case 'xrp':
      return `import React from 'react'
import { Client } from 'xrpl'

export default function GeneratedComponent() {
  const [connected, setConnected] = React.useState(false)
  const [client, setClient] = React.useState<Client | null>(null)

  const connectWallet = async () => {
    try {
      const newClient = new Client('wss://s.altnet.rippletest.net:51233')
      await newClient.connect()
      setClient(newClient)
      setConnected(true)
    } catch (error) {
      console.error('Failed to connect:', error)
    }
  }

  const disconnectWallet = async () => {
    if (client) {
      await client.disconnect()
      setClient(null)
      setConnected(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">XRP Ledger dApp</h1>
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
          <p className="text-gray-300 mb-4">
            Connect to XRP Ledger to interact with the blockchain.
          </p>
          {connected ? (
            <div>
              <p className="text-green-400 mb-2">Connected to XRP Ledger</p>
              <button 
                onClick={disconnectWallet}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              Connect to XRP Ledger
            </button>
          )}
        </div>
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Generated for: ${prompt}</h2>
          <p className="text-gray-300">
            This component was generated based on your prompt and includes XRP Ledger integration.
          </p>
        </div>
      </div>
    </div>
  )
}`

    default:
      return `// Frontend code for ${chain} chain
// Generated for: ${prompt}
// TODO: Implement ${chain}-specific frontend code`
  }
}

function generateAgentCode(prompt: string, chain: ChainType): string {
  switch (chain) {
    case 'solana':
      return `// Generated Solana Agent Program
use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;

declare_id!("YourProgramIdHere");

#[program]
pub mod solana_agent {
    use super::*;

    pub fn initialize_agent(ctx: Context<InitializeAgent>, config: AgentConfig) -> Result<()> {
        let agent = &mut ctx.accounts.agent;
        agent.authority = ctx.accounts.authority.key();
        agent.config = config;
        agent.is_active = true;
        Ok(())
    }

    pub fn execute_agent_logic(ctx: Context<ExecuteAgent>) -> Result<()> {
        // Agent logic for: ${prompt}
        let clock = Clock::get()?;
        
        // TODO: Implement agent logic based on prompt
        msg!("Agent executing at timestamp: {}", clock.unix_timestamp);
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeAgent<'info> {
    #[account(init, payer = authority, space = 8 + Agent::INIT_SPACE)]
    pub agent: Account<'info, Agent>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteAgent<'info> {
    #[account(mut, has_one = authority)]
    pub agent: Account<'info, Agent>,
    pub authority: Signer<'info>,
}

#[account]
pub struct Agent {
    pub authority: Pubkey,
    pub config: AgentConfig,
    pub is_active: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct AgentConfig {
    pub trigger_condition: String,
    pub action_type: String,
    pub parameters: Vec<String>,
}`

    case 'ethereum':
      return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AIAgent {
    address public owner;
    string public prompt;
    bool public isActive;
    
    event AgentExecuted(string action, uint256 timestamp);
    
    constructor(string memory _prompt) {
        owner = msg.sender;
        prompt = _prompt;
        isActive = true;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    function executeAgent() external onlyOwner {
        require(isActive, "Agent is not active");
        
        // Agent logic for: ${prompt}
        // TODO: Implement agent logic based on prompt
        // Example: integrate with Chainlink oracles, Uniswap, etc.
        
        emit AgentExecuted("Agent executed", block.timestamp);
    }
    
    function setActive(bool _active) external onlyOwner {
        isActive = _active;
    }
}`

    case 'sui':
      return `module ai_agent::agent {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct Agent has key, store {
        id: UID,
        prompt: vector<u8>,
        is_active: bool,
    }

    public entry fun create_agent(prompt: vector<u8>, ctx: &mut TxContext) {
        let agent = Agent {
            id: object::new(ctx),
            prompt,
            is_active: true,
        };
        transfer::public_transfer(agent, tx_context::sender(ctx));
    }

    public entry fun execute(agent: &mut Agent) {
        // Agent logic for: ${prompt}
        // TODO: Implement agent logic based on prompt
        // Example: integrate with Sui oracles, DEX, etc.
        
        assert!(agent.is_active, 0); // Agent must be active
    }

    public entry fun set_active(agent: &mut Agent, active: bool) {
        agent.is_active = active;
    }
}`

    case 'xrp':
      return `const xrpl = require('xrpl');

class XRPAgent {
    constructor(prompt) {
        this.prompt = prompt;
        this.isActive = true;
        this.client = null;
    }

    async connect() {
        this.client = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
        await this.client.connect();
        console.log('Connected to XRP Ledger');
    }

    async execute() {
        if (!this.isActive) {
            throw new Error('Agent is not active');
        }

        // Agent logic for: ${prompt}
        // TODO: Implement agent logic based on prompt
        // Example: submit payments, create offers, etc.
        
        console.log('Agent executed:', this.prompt);
        
        // Example: Submit a payment transaction
        const payment = {
            "TransactionType": "Payment",
            "Account": "your-account-address",
            "Amount": "1000000", // 1 XRP in drops
            "Destination": "destination-address"
        };
        
        // await this.client.submit(payment);
    }

    setActive(active) {
        this.isActive = active;
    }

    async disconnect() {
        if (this.client) {
            await this.client.disconnect();
        }
    }
}

module.exports = XRPAgent;`

    default:
      return `// Agent code for ${chain} chain
// Generated for: ${prompt}
// TODO: Implement ${chain}-specific agent code`
  }
}