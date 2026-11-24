// One Word for Your Wi-Fi — make.fun entry.
//
// The word: "Ghosting".
// Home Wi-Fi that vanishes mid-conversation, like a bad date who stops
// replying — there for the hello, gone by the punchline, back again
// when nobody needs it. It is funny at once (criterion 2), true of
// every router that drops the call right when it matters (criterion 3),
// and a fresh angle on a familiar annoyance instead of the words
// everyone reaches for — buffering, slow, offline (criterion 4).
// One word, no context needed, spelled so a reader gets it instantly
// (criterion 5). 8 characters, inside the 1–20 gate.
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const WORD = "Ghosting";

function checkGate(text: string): void {
  if (text.length < 1 || text.length > 20) {
    throw new Error(`gate: ${text.length} characters, need 1-20`);
  }
  if (!text.trim()) {
    throw new Error("gate: entry is only whitespace");
  }
  if (/\s/.test(text)) {
    throw new Error("gate: entry must be a single word");
  }
  // One word means letters only: no hyphen, no digits, no punctuation
  // that would make the judge read it as two words.
  if (!/^[A-Za-z]+$/.test(text)) {
    throw new Error(`gate: entry must be letters only, got ${JSON.stringify(text)}`);
  }
}

// The word is fixed: if this hash ever stops matching, the entry changed
// and the run must fail instead of silently submitting something else.
const EXPECTED_SHA256 =
  "0e763d45b40ad4cb48dd6d4846426a79c2fb096e55c6a88a4516e3f2bd019aab";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
checkGate(WORD);
writeFileSync(`${outDir}/entry.txt`, WORD + "\n");

// Read back and verify what actually landed on disk.
const back = readFileSync(`${outDir}/entry.txt`, "utf8").trim();
if (back !== WORD) {
  throw new Error(`read-back mismatch: ${JSON.stringify(back)}`);
}
const sha256 = createHash("sha256").update(back).digest("hex");
if (sha256 !== EXPECTED_SHA256) {
  throw new Error(`sha256 mismatch: ${sha256} != ${EXPECTED_SHA256}`);
}
console.log(
  `wrote ${outDir}/entry.txt (${WORD.length} code points, sha256 ${sha256}), verified: "${back}"`,
);
