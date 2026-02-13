# wallet-connect-skill

An [OpenClaw](https://github.com/openclaw/openclaw) skill that connects AI agents to crypto wallets via [WalletConnect](https://walletconnect.com) v2.

Agents can pair with any WalletConnect-compatible wallet, authenticate via consent signing, and request transactions — all with explicit user approval.

## How It Works

```
Agent                          User's Wallet
  │                                  │
  ├─ pair ─────── QR + URI ─────────►│
  │                                  │ ◄── User approves
  │◄──────────── session ────────────┤
  │                                  │
  ├─ auth ─────── sign request ─────►│
  │                                  │ ◄── User signs consent
  │◄──────────── signature ──────────┤
  │                                  │
  ├─ send-tx ──── tx request ───────►│
  │                                  │ ◄── User approves/rejects
  │◄──────────── tx hash ────────────┤
```

## Features

- **WalletConnect v2** — works with any compatible wallet (Gem, MetaMask, Rainbow, Trust, etc.)
- **Multi-chain** — EVM (Ethereum, Base, Arbitrum, Polygon, BSC) + Solana
- **Consent-based auth** — signed message with nonce proves wallet ownership
- **Token transfers** — native ETH/SOL + ERC-20 (USDC, USDT)
- **Session persistence** — sessions survive across agent restarts
- **Self-custodial** — keys never leave the user's wallet

## Quick Start

```bash
# Install dependencies
cd scripts && npm install

# Set your WalletConnect project ID
export WALLETCONNECT_PROJECT_ID=your_project_id

# Pair with a wallet
node scripts/wallet.mjs pair --chains eip155:1,solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp

# Authenticate (after pairing)
node scripts/wallet.mjs auth --topic <session_topic>

# Send a transaction
node scripts/wallet.mjs send-tx --topic <topic> --chain eip155:1 --to 0xADDRESS --amount 0.01

# Send ERC-20 tokens
node scripts/wallet.mjs send-tx --topic <topic> --chain eip155:1 --to 0xADDRESS --token USDC --amount 5.0

# Sign a message
node scripts/wallet.mjs sign --topic <topic> --message "Hello World"

# List sessions
node scripts/wallet.mjs sessions
```

## Commands

| Command | Description |
|---------|-------------|
| `pair` | Create a new WalletConnect pairing session |
| `auth` | Send consent sign request to verify wallet ownership |
| `sign` | Sign an arbitrary message |
| `send-tx` | Send a transaction (native or ERC-20 token) |
| `status` | Check a session's status |
| `sessions` | List all active sessions |

## As an OpenClaw Skill

Place this repo in your skills directory. The agent will use it when users ask to connect a wallet, sign messages, or make payments.

See [SKILL.md](SKILL.md) for the skill specification and agent workflow.

## Requirements

- Node.js 18+
- A [WalletConnect Cloud](https://cloud.walletconnect.com) project ID (free)

## License

MIT
