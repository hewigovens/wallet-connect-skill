# Supported Chains & Tokens

## EVM Chains

| Chain | CAIP-2 ID | Native | Notes |
|-------|-----------|--------|-------|
| Ethereum | `eip155:1` | ETH | Mainnet |
| Base | `eip155:8453` | ETH | Coinbase L2 |
| Arbitrum | `eip155:42161` | ETH | Arbitrum One |
| Optimism | `eip155:10` | ETH | OP Mainnet |
| Polygon | `eip155:137` | POL | Polygon PoS |
| BSC | `eip155:56` | BNB | Binance Smart Chain |

## EVM Tokens

| Token | Decimals | ETH | Base | Arbitrum | Optimism | Polygon | BSC |
|-------|----------|-----|------|----------|----------|---------|-----|
| USDC | 6 | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| USDT | 6 | ✅ | — | — | ✅ | ✅ | ✅ |
| WETH | 18 | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| DAI | 18 | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| WBTC | 8 | ✅ | — | ✅ | ✅ | ✅ | — |

### ERC-20 Contract Addresses

#### USDC
- Ethereum (`eip155:1`): `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`
- Base (`eip155:8453`): `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Arbitrum (`eip155:42161`): `0xaf88d065e77c8cC2239327C5EDb3A432268e5831`
- Optimism (`eip155:10`): `0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85`
- Polygon (`eip155:137`): `0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359`

#### USDT
- Ethereum (`eip155:1`): `0xdAC17F958D2ee523a2206206994597C13D831ec7`
- Optimism (`eip155:10`): `0x94b008aA00579c1307B0EF2c499aD98a8ce58e58`
- Polygon (`eip155:137`): `0xc2132D05D31c914a87C6611C10748AEb04B58e8F`
- BSC (`eip155:56`): `0x55d398326f99059fF775485246999027B3197955`

#### WETH
- Ethereum (`eip155:1`): `0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2`
- Arbitrum (`eip155:42161`): `0x82aF49447D8a07e3bd95BD0d56f35241523fBab1`
- Base (`eip155:8453`): `0x4200000000000000000000000000000000000006`
- Optimism (`eip155:10`): `0x4200000000000000000000000000000000000006`
- Polygon (`eip155:137`): `0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619`

#### DAI
- Ethereum (`eip155:1`): `0x6B175474E89094C44Da98b954EedeAC495271d0F`
- Arbitrum (`eip155:42161`): `0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1`
- Base (`eip155:8453`): `0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb`
- Optimism (`eip155:10`): `0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1`
- Polygon (`eip155:137`): `0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063`

#### WBTC
- Ethereum (`eip155:1`): `0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599`
- Arbitrum (`eip155:42161`): `0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f`
- Optimism (`eip155:10`): `0x68f180fcCe6836688e9084f035309E29Bf0A2095`
- Polygon (`eip155:137`): `0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6`

## EVM Methods

- `personal_sign` — sign a message (used for auth/consent)
- `eth_sendTransaction` — send a transaction (native or token transfer)
- `eth_signTypedData_v4` — EIP-712 typed data signing

## Solana

| Chain | CAIP-2 ID |
|-------|-----------|
| Mainnet | `solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp` |

### SPL Tokens (Mainnet)

| Token | Mint Address |
|-------|-------------|
| USDC | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` |
| USDT | `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB` |

## Solana Methods

- `solana_signMessage` — sign a message (bs58-encoded)
- `solana_signTransaction` — sign a transaction (base64 VersionedTransaction)
- `solana_signAndSendTransaction` — sign and broadcast (wallet submits to network)
