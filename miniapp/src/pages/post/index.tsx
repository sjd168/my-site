import { Navigator, RichText, View } from "@tarojs/components";
import Taro, { useRouter } from "@tarojs/taro";

import postsData from "../../data/posts.json";

import "./index.scss";

const posts = postsData;

export default function PostPage() {
  const router = useRouter();
  const slug = decodeURIComponent(router.params.slug ?? "");
  const post = posts.find((item) => item.slug === slug);

  if (!post) {
    return (
      <View className="page">
        <View className="not-found">文章不存在或还未生成数据。</View>
      </View>
    );
  }

  return (
    <View className="page">
      <Navigator
        className="back"
        openType="switchTab"
        url="/pages/index/index"
      >
        ← 返回列表
      </Navigator>
      <View className="title">{post.title}</View>
      <View className="date">{post.date}</View>
      {post.description ? <View className="desc">{post.description}</View> : null}
      <View className="content">
        <RichText nodes={post.contentHtml} />
      </View>
      <View
        style={{ height: "40px" }}
        onClick={() => {
          Taro.pageScrollTo({ scrollTop: 0, duration: 300 });
        }}
      />
    </View>
  );
}
