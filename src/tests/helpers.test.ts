/**
 * Unit tests for src/helpers.ts — pure functions only (no network / WC).
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { redactAddress, encodeEvmMessage, encodeSolMessage, findAccount } from "../helpers.js";

// ---------------------------------------------------------------------------
// redactAddress
// ---------------------------------------------------------------------------

describe("redactAddress", () => {
  it("redacts an EVM address (0x prefix) with default keep=7", () => {
    const addr = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const result = redactAddress(addr);
    assert.match(result, /^0x[0-9a-fA-F]{7}\.\.\.([0-9a-fA-F]{7})$/);
    assert.ok(result.startsWith("0xC02aaA3"), `expected 0xC02aaA3…, got ${result}`);
  });

  it("redacts a base58 Solana address", () => {
    const addr = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    const result = redactAddress(addr);
    assert.ok(result.includes("..."), "should contain ellipsis");
    assert.ok(result.startsWith("EPjFWdd"), `expected EPjFWdd…, got ${result}`);
    assert.ok(result.endsWith("TDt1v"), `expected …TDt1v, got ${result}`);
  });

  it("passes through a short address unchanged", () => {
    const short = "0x1234";
    assert.equal(redactAddress(short), short);
  });

  it("respects custom keep parameter", () => {
    const addr = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    const result = redactAddress(addr, 4);
    // 0x + 4 hex + ... + 4 hex
    assert.match(result, /^0x[0-9a-fA-F]{4}\.\.\.[0-9a-fA-F]{4}$/);
  });

  it("passes through empty string", () => {
    assert.equal(redactAddress(""), "");
  });
});

// ---------------------------------------------------------------------------
// encodeEvmMessage
// ---------------------------------------------------------------------------

describe("encodeEvmMessage", () => {
  it("encodes ASCII to hex with 0x prefix", () => {
    // "hello" -> 68656c6c6f
    assert.equal(encodeEvmMessage("hello"), "0x68656c6c6f");
  });

  it("encodes empty string to 0x", () => {
    assert.equal(encodeEvmMessage(""), "0x");
  });

  it("encodes UTF-8 multi-byte characters", () => {
    // "é" is 0xc3 0xa9 in UTF-8
    assert.equal(encodeEvmMessage("é"), "0xc3a9");
  });

  it("round-trips: Buffer.from(hex.slice(2), hex) equals original", () => {
    const msg = "Sign in to MyApp at 2024-01-01T00:00:00Z";
    const hex = encodeEvmMessage(msg);
    assert.ok(hex.startsWith("0x"));
    const decoded = Buffer.from(hex.slice(2), "hex").toString("utf8");
    assert.equal(decoded, msg);
  });
});

// ---------------------------------------------------------------------------
// encodeSolMessage
// ---------------------------------------------------------------------------

describe("encodeSolMessage", () => {
  it("encodes a message to base58", () => {
    const encoded = encodeSolMessage("hello");
    // base58 of "hello" utf8 bytes
    assert.ok(typeof encoded === "string");
    assert.ok(encoded.length > 0);
    assert.ok(!encoded.startsWith("0x"), "should not be hex");
  });

  it("round-trips via bs58 decode", async () => {
    const { default: bs58 } = await import("bs58");
    const msg = "Verify wallet ownership";
    const encoded = encodeSolMessage(msg);
    const decoded = Buffer.from(bs58.decode(encoded)).toString("utf8");
    assert.equal(decoded, msg);
  });
});

// ---------------------------------------------------------------------------
// findAccount
// ---------------------------------------------------------------------------

describe("findAccount", () => {
  const accounts = [
    "eip155:1:0xDeadBeef",
    "eip155:137:0xPolygon",
    "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:SolAddr",
  ];

  it("returns first account when chainHint is undefined", () => {
    assert.equal(findAccount(accounts, undefined), "eip155:1:0xDeadBeef");
  });

  it("returns exact match on full chain prefix", () => {
    assert.equal(findAccount(accounts, "eip155:137"), "eip155:137:0xPolygon");
  });

  it("returns match for namespace only", () => {
    assert.equal(findAccount(accounts, "solana"), "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp:SolAddr");
  });

  it("returns null when no matching account found", () => {
    assert.equal(findAccount(accounts, "cosmos:osmosis-1"), null);
  });

  it("returns null for empty accounts array", () => {
    assert.equal(findAccount([], "eip155:1"), null);
  });

  it("falls back to namespace when exact chain not found", () => {
    // eip155:10 (Optimism) not in list, but eip155 namespace is
    const result = findAccount(accounts, "eip155:10");
    assert.ok(result?.startsWith("eip155:"), `expected eip155 fallback, got ${result}`);
  });
});
