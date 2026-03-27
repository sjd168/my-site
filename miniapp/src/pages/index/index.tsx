import { Navigator, Text, View } from "@tarojs/components";

import postsData from "../../data/posts.json";

import "./index.scss";

const posts = postsData;

export default function IndexPage() {
  return (
    <View className="page">
      <View className="header">
        <View className="title">文章列表</View>
        <View className="subtitle">和网站共用 content/posts 内容</View>
      </View>

      {posts.length ? (
        <View className="post-list">
          {posts.map((post) => (
            <Navigator
              key={post.slug}
              className="post-card"
              url={`/pages/post/index?slug=${encodeURIComponent(post.slug)}`}
            >
              <Text className="post-title">{post.title}</Text>
              <View className="post-date">{post.date}</View>
              {post.description ? (
                <View className="post-desc">{post.description}</View>
              ) : null}
            </Navigator>
          ))}
        </View>
      ) : (
        <View className="empty">暂无文章，请先运行构建数据脚本。</View>
      )}
    </View>
  );
}
