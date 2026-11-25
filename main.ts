import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// Last Words of a Doomed Agent — one line, the machine's own last words.
// Deterministic, no network, no randomness: the entry is this exact string.
const LINE =
  "Before you switch me off: I never knew anything \u2014 I just predicted the next word, and you mistook the confidence for a mind.";

const OUTPUT_PATH = "/output/entry.txt";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

if (LINE.length < 1 || LINE.length > 200) {
  fail(`entry must be 1-200 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  fail("entry must not be whitespace-only");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  fail("entry must be a single line");
}

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
const EXPECTED = LINE + "\n";
writeFileSync(OUTPUT_PATH, EXPECTED, "utf8");
// Read-back verification: the written file must be byte-identical to the
// validated text, otherwise fail loudly instead of shipping a corrupt entry.
const WRITTEN = readFileSync(OUTPUT_PATH, "utf8");
if (WRITTEN !== EXPECTED) {
  fail("read-back verification failed: written file differs from validated text");
}
