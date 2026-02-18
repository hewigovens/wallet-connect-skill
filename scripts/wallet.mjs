#!/usr/bin/env node
/**
 * wallet-connect-skill CLI entry point.
 *
 * Commands:
 *   pair           Create a new pairing session
 *   status         Check session status
 *   auth           Send consent sign request
 *   sign           Sign an arbitrary message
 *   send-tx        Send a transaction
 *   sessions       List active sessions (raw JSON)
 *   list-sessions  List sessions with accounts, peer, and date
 *   whoami         Show account info for a session
 */

import { parseArgs } from "util";
import { cmdPair } from "./lib/pair.mjs";
import { cmdAuth } from "./lib/auth.mjs";
import { cmdSign } from "./lib/sign.mjs";
import { cmdSendTx } from "./lib/send-tx.mjs";
import { loadSessions, findSessionByAddress } from "./lib/client.mjs";

// --- Resolve --address to --topic ---

function resolveAddress(args) {
  if (args.address && !args.topic) {
    const sessions = loadSessions();
    const match = findSessionByAddress(sessions, args.address);
    if (!match) {
      console.error(JSON.stringify({ error: "No session found for address", address: args.address }));
      process.exit(1);
    }
    args.topic = match.topic;
  }
  return args;
}

// --- Simple commands ---

async function cmdStatus(args) {
  args = resolveAddress(args);
  if (!args.topic) {
    console.error(JSON.stringify({ error: "--topic or --address required" }));
    process.exit(1);
  }
  const sessions = loadSessions();
  const session = sessions[args.topic];
  if (!session) {
    console.log(JSON.stringify({ status: "not_found", topic: args.topic }));
    return;
  }
  console.log(JSON.stringify({ status: "active", ...session }));
}

async function cmdSessions() {
  const sessions = loadSessions();
  console.log(JSON.stringify(sessions, null, 2));
}

async function cmdListSessions() {
  const sessions = loadSessions();
  const entries = Object.entries(sessions);
  if (entries.length === 0) {
    console.log("No saved sessions.");
    return;
  }
  for (const [topic, s] of entries) {
    const accounts = (s.accounts || []).map((a) => {
      const parts = a.split(":");
      const chain = parts.slice(0, 2).join(":");
      const addr = parts.slice(2).join(":");
      return `  ${chain} → ${addr}`;
    });
    const auth = s.authenticated ? " ✓ authenticated" : "";
    const date = s.createdAt ? new Date(s.createdAt).toISOString().slice(0, 16) : "unknown";
    console.log(`Topic: ${topic.slice(0, 12)}...`);
    console.log(`  Peer: ${s.peerName || "unknown"}${auth}`);
    console.log(`  Created: ${date}`);
    console.log(`  Accounts:`);
    accounts.forEach((a) => console.log(`  ${a}`));
    console.log();
  }
}

async function cmdWhoami(args) {
  args = resolveAddress(args);
  const sessions = loadSessions();

  if (args.topic) {
    const session = sessions[args.topic];
    if (!session) {
      console.error(JSON.stringify({ error: "Session not found", topic: args.topic }));
      process.exit(1);
    }
    console.log(JSON.stringify({
      topic: args.topic,
      peerName: session.peerName,
      accounts: session.accounts,
      authenticated: session.authenticated || false,
      createdAt: session.createdAt,
    }, null, 2));
    return;
  }

  // No topic/address: show latest session
  const entries = Object.entries(sessions);
  if (entries.length === 0) {
    console.log(JSON.stringify({ error: "No sessions found" }));
    return;
  }
  entries.sort((a, b) => (b[1].updatedAt || b[1].createdAt || "").localeCompare(a[1].updatedAt || a[1].createdAt || ""));
  const [topic, session] = entries[0];
  console.log(JSON.stringify({
    topic,
    peerName: session.peerName,
    accounts: session.accounts,
    authenticated: session.authenticated || false,
    createdAt: session.createdAt,
  }, null, 2));
}

// --- CLI ---

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    chains: { type: "string" },
    topic: { type: "string" },
    address: { type: "string" },
    message: { type: "string" },
    chain: { type: "string" },
    to: { type: "string" },
    amount: { type: "string" },
    token: { type: "string" },
    help: { type: "boolean", short: "h" },
  },
});

const command = positionals[0];

if (!command || values.help) {
  console.log(`Usage: wallet.mjs <command> [options]

Commands:
  pair           Create pairing session (--chains eip155:1,solana:...)
  status         Check session (--topic <topic> | --address <addr>)
  auth           Send consent sign (--topic <topic> | --address <addr>)
  sign           Sign message (--topic <topic> | --address <addr>) --message <msg>
  send-tx        Send transaction (--topic <topic> | --address <addr>) --chain <chain> --to <addr> --amount <n> [--token USDC]
  sessions       List all sessions (raw JSON)
  list-sessions  List sessions (human-readable)
  whoami         Show account info (--topic <topic> | --address <addr>)

Options:
  --address <0x...>  Select session by wallet address (case-insensitive)`);
  process.exit(0);
}

const commands = {
  pair: cmdPair,
  status: cmdStatus,
  auth: (args) => { args = resolveAddress(args); return cmdAuth(args); },
  sign: (args) => { args = resolveAddress(args); return cmdSign(args); },
  "send-tx": (args) => { args = resolveAddress(args); return cmdSendTx(args); },
  sessions: cmdSessions,
  "list-sessions": cmdListSessions,
  whoami: cmdWhoami,
};

if (!commands[command]) {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

commands[command](values).catch((err) => {
  console.error(JSON.stringify({ error: err.message }));
  process.exit(1);
});
