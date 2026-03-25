import Link from "next/link";

import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          记录学习、踩坑和一些想法。
        </p>
      </header>

      <ul className="space-y-6">
        {posts.map((p) => (
          <li key={p.slug} className="rounded-2xl border border-black/5 p-5">
            <div className="flex flex-col gap-1">
              <Link
                className="text-xl font-semibold hover:underline"
                href={`/blog/${p.slug}`}
              >
                {p.title}
              </Link>
              <time className="text-sm text-zinc-600 dark:text-zinc-400">
                {p.date}
              </time>
              {p.description ? (
                <p className="mt-2 text-zinc-700 dark:text-zinc-300">
                  {p.description}
                </p>
              ) : null}
              {p.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-black/[.04] px-3 py-1 text-xs text-zinc-700 dark:bg-white/[.08] dark:text-zinc-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      {!posts.length ? (
        <p className="mt-10 text-zinc-600 dark:text-zinc-400">
          还没有文章。你可以在 `content/posts/` 新建一个 `.md` 文件。
        </p>
      ) : null}
    </div>
  );
}
