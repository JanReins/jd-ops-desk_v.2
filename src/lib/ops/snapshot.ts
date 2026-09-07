import type { Client, Obligation } from "./types";
import { replaceUserData } from "./idb";

export interface SnapshotData {
  version: 1;
  kind: "ops-desk-snapshot";
  exportedAt: string;
  email: string;
  clients: Client[];
  obligations: Obligation[];
}

export function exportSnapshot(
  clients: Client[],
  obligations: Obligation[],
  email?: string | null,
): Blob {
  const snapshot: SnapshotData = {
    version: 1,
    kind: "ops-desk-snapshot",
    exportedAt: new Date().toISOString(),
    email: email || "",
    clients,
    obligations,
  };

  const json = JSON.stringify(snapshot, null, 2);
  return new Blob([json], { type: "application/json" });
}

export function parseSnapshot(text: string): SnapshotData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("File is not valid JSON.");
  }

  if (!parsed || typeof parsed !== "object") {
    throw new Error("Snapshot root must be a JSON object.");
  }

  const candidate = parsed as Record<string, unknown>;

  if (candidate.kind !== "ops-desk-snapshot") {
    throw new Error('Invalid file kind: expected "ops-desk-snapshot".');
  }

  if (candidate.version !== 1) {
    throw new Error(`Unsupported snapshot version: ${candidate.version}. Expected version 1.`);
  }

  if (!Array.isArray(candidate.clients)) {
    throw new Error('Snapshot missing "clients" array.');
  }

  if (!Array.isArray(candidate.obligations)) {
    throw new Error('Snapshot missing "obligations" array.');
  }

  return {
    version: 1,
    kind: "ops-desk-snapshot",
    exportedAt:
      typeof candidate.exportedAt === "string" ? candidate.exportedAt : new Date().toISOString(),
    email: typeof candidate.email === "string" ? candidate.email : "",
    clients: candidate.clients as Client[],
    obligations: candidate.obligations as Obligation[],
  };
}

export function checkSnapshotOrphans(snapshot: SnapshotData): {
  orphanCount: number;
  orphanIds: string[];
} {
  const clientIds = new Set(snapshot.clients.map((c) => c.id));
  const orphanIds: string[] = [];

  for (const ob of snapshot.obligations) {
    if (!clientIds.has(ob.clientId)) {
      orphanIds.push(ob.id);
    }
  }

  return {
    orphanCount: orphanIds.length,
    orphanIds,
  };
}

export async function applySnapshot(uid: string, snapshot: SnapshotData): Promise<void> {
  await replaceUserData(uid, snapshot.clients, snapshot.obligations);
}
