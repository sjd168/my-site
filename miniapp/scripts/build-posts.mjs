import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const rootDir = path.resolve(process.cwd(), "..");
const postsDir = path.join(rootDir, "content", "posts");
const outputPath = path.join(process.cwd(), "src", "data", "posts.json");

function toDateOnly(value) {
  return value.toISOString().slice(0, 10);
}

function listPostFiles() {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((name) => name.toLowerCase().endsWith(".md"))
    .sort();
}

function slugFromFilename(filename) {
  return filename.replace(/\.md$/i, "");
}

function parseFrontmatter(data, slug, fullPath) {
  const title =
    typeof data?.title === "string" && data.title.trim() ? data.title.trim() : slug;

  let date = "";
  if (typeof data?.date === "string" && data.date.trim()) {
    date = data.date.trim();
  } else {
    try {
      const stat = fs.statSync(fullPath);
      date = toDateOnly(stat.birthtime);
    } catch {
      date = toDateOnly(new Date());
    }
  }

  const description =
    typeof data?.description === "string" ? data.description : undefined;
  const tags = Array.isArray(data?.tags)
    ? data.tags.filter((tag) => typeof tag === "string")
    : undefined;

  return { title, date, description, tags };
}

async function run() {
  const files = listPostFiles();
  const posts = [];

  for (const filename of files) {
    const slug = slugFromFilename(filename);
    const fullPath = path.join(postsDir, filename);
    const source = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(source);
    const meta = parseFrontmatter(data, slug, fullPath);
    const contentHtml = String(await remark().use(html).process(content));
    posts.push({ slug, ...meta, contentHtml });
  }

  posts.sort((a, b) => b.date.localeCompare(a.date));
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
  console.log(`Built ${posts.length} post(s) -> ${outputPath}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
