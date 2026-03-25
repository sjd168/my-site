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

function parseFrontmatterOrThrow(data: unknown, slug: string): PostFrontmatter {
  const fm = (data ?? {}) as Partial<PostFrontmatter>;
  if (!fm.title || typeof fm.title !== "string") {
    throw new Error(`Missing/invalid title in post: ${slug}`);
  }
  if (!fm.date || typeof fm.date !== "string") {
    throw new Error(`Missing/invalid date in post: ${slug}`);
  }
  const tags = Array.isArray(fm.tags)
    ? fm.tags.filter((t): t is string => typeof t === "string")
    : undefined;

  return {
    title: fm.title,
    date: fm.date,
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
    const fm = parseFrontmatterOrThrow(data, slug);
    return { slug, ...fm };
  });

  // Desc by date string "YYYY-MM-DD" works lexicographically.
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostBySlug(slug: string): Promise<PostDetail> {
  const fullPath = path.join(POSTS_DIR, `${slug}.md`);
  const file = fs.readFileSync(fullPath, "utf8");
  const { content, data } = matter(file);
  const fm = parseFrontmatterOrThrow(data, slug);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return { slug, ...fm, contentHtml };
}
