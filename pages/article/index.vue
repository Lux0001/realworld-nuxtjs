<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>
        <articleMeta :article="article"></articleMeta>
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12" v-html="article.body"></div>
      </div>
      <ul
        class="tag-list"
      >
        <li
          class="tag-default tag-pill tag-outline"
          v-for="(tag, index) in article.tagList"
          :key="index"
        >
          {{ tag }}
        </li>
      </ul>
      <hr />

      <div class="article-actions">
        <articleMeta :article="article"></articleMeta>
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <articleComments :article="article"></articleComments>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getArticle } from "@/api/article";
import MarkdownIt from "markdown-it";
import articleMeta from "./components/article-meta.vue";
import articleComments from "./components/article-comments.vue";
export default {
  components: { articleMeta, articleComments },
  head() {
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: "description", // 为meta标签添加唯一标识编号
          name: "description",
          content: this.article.description,
        },
      ],
    };
  },
  name: "ArticleIndex",
  async asyncData({ params }) {
    const { data } = await getArticle(params.slug);
    const { article } = data;
    const md = new MarkdownIt();
    article.body = md.render(article.body);
    return {
      article,
    };
  },
};
</script>

<style>
</style>