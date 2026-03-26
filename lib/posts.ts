import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type PostFrontmatter = {
  title: string;
  date: string; // ISO-like "YYYY-MM-DD"
  description?: string;
  tags?: string[];
};

export type PostListItem = PostFrontmatter & {
  slug: string;
};

export type PostDetail = PostListItem & {
  contentHtml: string;
};

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function toDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function listPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.toLowerCase().endsWith(".md"))
    .sort();
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/i, "");
}

function resolveFallbackDate(fullPath: string): string {
  try {
    const stat = fs.statSync(fullPath);
    if (!Number.isNaN(stat.birthtime.getTime())) {
      return toDateOnly(stat.birthtime);
    }
  } catch {
    // Fall through to current date.
  }
  return toDateOnly(new Date());
}

function parseFrontmatter(
  data: unknown,
  slug: string,
  fullPath: string
): PostFrontmatter {
  const fm = (data ?? {}) as Partial<PostFrontmatter>;

  const title =
    typeof fm.title === "string" && fm.title.trim() ? fm.title.trim() : slug;
  const date =
    typeof fm.date === "string" && fm.date.trim()
      ? fm.date.trim()
      : resolveFallbackDate(fullPath);

  const tags = Array.isArray(fm.tags)
    ? fm.tags.filter((t): t is string => typeof t === "string")
    : undefined;

  return {
    title,
    date,
    description: typeof fm.description === "string" ? fm.description : undefined,
    tags,
  };
}

export function getAllPosts(): PostListItem[] {
  const files = listPostFiles();
  const items = files.map((filename) => {
    const slug = slugFromFilename(filename);
    const fullPath = path.join(POSTS_DIR, filename);
    const file = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(file);
    const fm = parseFrontmatter(data, slug, fullPath);
    return { slug, ...fm };
  });

  // Desc by date string "YYYY-MM-DD" works lexicographically.
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostBySlug(slug: string): Promise<PostDetail> {
  const fullPath = path.join(POSTS_DIR, `${slug}.md`);
  const file = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(file);
  const fm = parseFrontmatter(data, slug, fullPath);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return { slug, ...fm, contentHtml };
}
