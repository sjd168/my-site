import { View } from "@tarojs/components";

import "./index.scss";

export default function AboutPage() {
  return (
    <View className="page">
      <View className="card">
        <View className="title">关于我</View>
        <View className="desc">
          你好，我是这个博客的作者。
          <View>这里主要记录学习笔记、踩坑经历和一些技术思考。</View>
          <View>网站与小程序共用同一份 Markdown 内容，方便统一维护。</View>
        </View>
        <View className="tips">后续会继续补充：分类、搜索、标签筛选和归档。</View>
      </View>
    </View>
  );
}
