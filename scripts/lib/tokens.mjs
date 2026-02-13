/**
 * Token registry — centralized metadata for ERC-20 and SPL tokens.
 *
 * To add a new token:
 * 1. Add an entry to TOKENS with the token symbol as key
 * 2. Set `decimals` (usually 6 for stablecoins, 18 for most ERC-20)
 * 3. Add contract addresses per chain in `addresses`
 *    - EVM chains use CAIP-2 IDs (e.g. "eip155:1" for Ethereum mainnet)
 *    - Solana uses "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp" for mainnet
 * 4. For Solana SPL tokens, the address is the mint public key
 */

export const TOKENS = {
  USDC: {
    name: "USD Coin",
    decimals: 6,
    addresses: {
      // EVM
      "eip155:1": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "eip155:8453": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "eip155:42161": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
      // Solana
      "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    },
  },
  USDT: {
    name: "Tether USD",
    decimals: 6,
    addresses: {
      // EVM
      "eip155:1": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      "eip155:56": "0x55d398326f99059fF775485246999027B3197955",
      // Solana
      "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    },
  },
};

/**
 * Look up a token's contract address on a specific chain.
 * Returns null if the token isn't supported on that chain.
 */
export function getTokenAddress(symbol, chainId) {
  return TOKENS[symbol]?.addresses?.[chainId] || null;
}

/**
 * Get a token's decimal places.
 * Falls back to 18 (standard ERC-20 default) if unknown.
 */
export function getTokenDecimals(symbol) {
  return TOKENS[symbol]?.decimals ?? 18;
}

/**
 * Check if a token symbol is a known SPL token on the given Solana chain.
 */
export function isSplToken(symbol, chainId) {
  return chainId.startsWith("solana:") && !!getTokenAddress(symbol, chainId);
}

/**
 * List all supported tokens for a given chain.
 */
export function getTokensForChain(chainId) {
  const result = [];
  for (const [symbol, token] of Object.entries(TOKENS)) {
    if (token.addresses[chainId]) {
      result.push({ symbol, ...token, address: token.addresses[chainId] });
    }
  }
  return result;
}
