---
name: wallet-connect
description: Connect AI agents to crypto wallets via WalletConnect. Use when the agent needs to pair with a wallet, sign messages, or send transactions (EVM and Solana). Triggers on wallet pairing, crypto payments, transaction signing, or wallet connection requests.
---

# Wallet Connect Skill

Connect to user's crypto wallet via WalletConnect v2. Supports EVM chains and Solana.

## Quick Start

```bash
node scripts/wallet.mjs <command> [args]
```

## Commands

### Pair (one-time onboarding)
```bash
node scripts/wallet.mjs pair --chains eip155:1,solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp
```
Output: `{ uri, qrPath, topic }`

### Authenticate (consent sign)
```bash
node scripts/wallet.mjs auth --topic <topic>
```
Output: `{ address, signature, nonce }` after user approves in wallet.

### Send Transaction
```bash
# EVM: send USDC transfer
node scripts/wallet.mjs send-tx --topic <topic> --chain eip155:1 \
  --to 0xRECIPIENT --token USDC --amount 5.0
```

### Sign Message
```bash
node scripts/wallet.mjs sign --topic <topic> --message "Hello World"
```

## Onboarding Workflow

When user asks to pair their wallet:

1. Run `pair` → get URI + QR path
2. Send **two messages** to user:
   - **Message 1:** "🔗 Pair your wallet" + QR image as attachment
   - **Message 2:** Raw WC URI only (no surrounding text — user copies on phone)
3. User copies URI into wallet app → approves pairing
4. Run `auth` → wallet receives consent sign request
5. User approves → agent stores session topic + verified address
6. Confirm to user: "✅ Wallet connected"

**Important UX rules:**
- Send the raw `wc:` URI as its own message with NO other text (user needs to copy it)
- QR code is a fallback — most mobile users will copy the URI
- The pair command blocks waiting for approval (5 min timeout)
- Kill the pair process after receiving the paired response, then run auth separately

## Transaction Workflow

1. Agent decides a payment is needed
2. Message user: "I need to send X USDC to 0xABC for [reason]. Please approve in your wallet."
3. Run `send-tx` → user gets push notification in wallet
4. User approves/rejects → agent gets tx hash or rejection
5. Continue based on outcome

## Session Persistence

- WC client sessions: `~/.agent-wallet/wc-store/` (persistent across runs)
- App session data: `~/.agent-wallet/sessions.json` (accounts, auth status)
- Sessions are valid until user disconnects from their wallet

## Verification

WalletConnect Verify API automatically validates the domain in metadata against the actual origin. Set the metadata URL to a domain you control (currently `https://shiorix.hewig.dev`). No manual domain listing required.

## Environment

- `WALLETCONNECT_PROJECT_ID` — required (current: configured in env)

## Chain Reference

See [references/chains.md](references/chains.md) for supported chain IDs and token addresses.
