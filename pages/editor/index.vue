<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="(message, index) in messages" :key="index">
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>
          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="article.title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="article.description"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="article.body"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  @keyup.enter="addTag"
                  v-model="tag"
                />
                <div class="tag-list">
                  <span
                    v-for="(tag, index) in article.tagList"
                    :key="index"
                    class="tag-default tag-pill"
                    @click="deleteTag(index)"
                  >
                    <i class="ion-close-round"></i>
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="addArticle"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { publishArticle, getArticle } from "@/api/article";
export default {
  // 在路由匹配组件渲染之前会先执行中间件处理
  middleware: "authenticated", // 如果有多个中间件可以放在数组中
  name: "EditorIndex",
  data() {
    return {
      article: {
        title: "",
        description: "",
        body: "",
        tagList: [],
      },
      tag: "",
      errors: [],
    };
  },
  async created() {
    if (this.$route.query.slug) {
      const { data } = await getArticle(this.$route.query.slug)
      const { article } = data
      this.article = {
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList,
      }
    }
  },
  methods: {
    addTag() {
      this.article.tagList.push(this.tag);
      this.tag = "";
    },
    deleteTag(index) {
      this.article.tagList.splice(index, 1);
    },
    async addArticle() {
      try {
        const { data } = await publishArticle(this.article);
        const { slug } = data.article;
        this.$router.push(`/article/${slug}`);
      } catch (error) {
        this.errors = error.response.data.errors;
      }
    },
  },
};
</script>

<style>
</style>