/**
 * Session health command — ping a WalletConnect session to check liveness.
 *
 * Uses SignClient.ping({ topic }) which sends a wc_sessionPing request to the
 * connected wallet. Resolves if the wallet responds within the timeout, rejects
 * (or times out) if the session is stale / peer is offline.
 *
 * Options:
 *   --topic <topic>    Check a specific session by topic
 *   --address <0x...>  Check the session that owns this address
 *   --all              Ping all known sessions (reports each)
 *   --clean            Remove dead sessions from sessions.json
 */

import { getClient, loadSessions, saveSessions, findSessionByAddress } from "./client.mjs";
import { redactAddress } from "./helpers.mjs";

const PING_TIMEOUT_MS = 15000; // 15s — wallets are usually fast to pong

/**
 * Ping a single session topic. Returns { alive: bool, error?: string }.
 */
async function pingSession(client, topic) {
  try {
    await Promise.race([
      client.ping({ topic }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("ping timeout")), PING_TIMEOUT_MS),
      ),
    ]);
    return { alive: true };
  } catch (err) {
    return { alive: false, error: err.message };
  }
}

export async function cmdHealth(args) {
  const sessions = loadSessions();

  // Resolve which topics to ping
  let topics = [];

  if (args.all) {
    topics = Object.keys(sessions);
    if (topics.length === 0) {
      console.log(JSON.stringify({ status: "no_sessions", message: "No sessions found" }));
      process.exit(0);
    }
  } else if (args.topic) {
    if (!sessions[args.topic]) {
      console.error(JSON.stringify({ error: "Session not found", topic: args.topic }));
      process.exit(1);
    }
    topics = [args.topic];
  } else if (args.address) {
    const match = findSessionByAddress(sessions, args.address);
    if (!match) {
      console.error(JSON.stringify({ error: "No session found for address", address: args.address }));
      process.exit(1);
    }
    topics = [match.topic];
  } else {
    console.error(
      JSON.stringify({ error: "--topic, --address, or --all required for health command" }),
    );
    process.exit(1);
  }

  const client = await getClient();
  const results = [];
  const deadTopics = [];

  for (const topic of topics) {
    const session = sessions[topic];
    const accounts = session.accounts || [];
    const peerName = session.peerName || "unknown";

    process.stderr.write(
      JSON.stringify({ pinging: topic, peer: peerName }) + "\n",
    );

    const { alive, error } = await pingSession(client, topic);

    const shortAddresses = accounts.map((a) => {
      const parts = a.split(":");
      return redactAddress(parts.slice(2).join(":"));
    });

    const entry = {
      topic: topic.slice(0, 16) + "…",
      fullTopic: topic,
      peerName,
      accounts: shortAddresses,
      alive,
      ...(error && { error }),
    };

    results.push(entry);

    if (!alive) {
      deadTopics.push(topic);
    }
  }

  // Clean dead sessions if requested
  let cleaned = 0;
  if (args.clean && deadTopics.length > 0) {
    const updated = { ...sessions };
    for (const t of deadTopics) {
      delete updated[t];
    }
    saveSessions(updated);
    cleaned = deadTopics.length;
  }

  const output = {
    checked: results.length,
    alive: results.filter((r) => r.alive).length,
    dead: results.filter((r) => !r.alive).length,
    ...(args.clean && { cleaned }),
    sessions: results,
  };

  console.log(JSON.stringify(output, null, 2));
  await client.core.relayer.transportClose();
}
