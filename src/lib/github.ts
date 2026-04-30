const BASE   = "https://api.github.com";
const OWNER  = process.env.GITHUB_OWNER!;
const REPO   = process.env.GITHUB_REPO!;
const BRANCH = process.env.GITHUB_BRANCH ?? "main";
const TOKEN  = process.env.GITHUB_TOKEN!;

const GH_HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "Content-Type": "application/json",
};

async function getFileSHA(path: string): Promise<string | null> {
  const res = await fetch(
    `${BASE}/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`,
    { headers: GH_HEADERS, cache: "no-store" }
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.sha ?? null;
}

export async function writeFileToGitHub(
  path: string,
  content: string,
  message: string
): Promise<void> {
  const sha = await getFileSHA(path);
  const body: Record<string, string> = {
    message,
    content: Buffer.from(content, "utf-8").toString("base64"),
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(`${BASE}/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: GH_HEADERS,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub write failed: ${err}`);
  }
}

export async function uploadImageToGitHub(
  path: string,
  base64Data: string, // raw base64, no data:... prefix
  message: string
): Promise<string> {
  const sha = await getFileSHA(path);
  const body: Record<string, string> = {
    message,
    content: base64Data,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(`${BASE}/repos/${OWNER}/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: GH_HEADERS,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub image upload failed: ${err}`);
  }

  return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${path}`;
}