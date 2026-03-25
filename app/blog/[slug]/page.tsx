import Link from "next/link";
import { notFound } from "next/navigation";

import { getAllPosts, getPostBySlug } from "@/lib/posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    return {
      title: post.title,
      description: post.description,
    };
  } catch {
    return { title: "Post not found" };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="mb-10">
        <Link className="text-sm text-zinc-600 hover:underline" href="/blog">
          ← Back to blog
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          {post.title}
        </h1>
        <time className="mt-2 block text-sm text-zinc-600 dark:text-zinc-400">
          {post.date}
        </time>
        {post.description ? (
          <p className="mt-4 text-zinc-700 dark:text-zinc-300">
            {post.description}
          </p>
        ) : null}
      </div>

      <article
        className={[
          "leading-8 text-zinc-800 dark:text-zinc-200",
          "[&_h1]:mt-8 [&_h1]:text-3xl [&_h1]:font-semibold",
          "[&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold",
          "[&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold",
          "[&_p]:my-4",
          "[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6",
          "[&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6",
          "[&_a]:underline",
          "[&_code]:rounded [&_code]:bg-black/[.04] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.95em]",
          "dark:[&_code]:bg-white/[.08]",
          "[&_pre]:my-5 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-black/[.04] [&_pre]:p-4",
          "dark:[&_pre]:bg-white/[.08]",
        ].join(" ")}
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </div>
  );
}
