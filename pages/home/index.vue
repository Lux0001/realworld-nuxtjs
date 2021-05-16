<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-if="user" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'your_feed' }"
                  :to="{ name: 'home', query: { tab: 'your_feed' } }"
                  >Your Feed</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'global_feed' }"
                  :to="{ name: 'home', query: { tab: 'global_feed' } }"
                  >Global Feed</nuxt-link
                >
              </li>
              <li v-if="tag" class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :class="{ active: tab === 'tag' }"
                  :to="{ name: 'home', query: { tab: 'tag' } }"
                  >#{{ tag }}</nuxt-link
                >
              </li>
            </ul>
          </div>
          <div
            v-show="articles.length === 0 && loading == false"
            class="article-preview"
          >
            No articles are here... yet.
          </div>
          <div v-show="loading === true" class="article-preview">
            Loading articles...
          </div>
          <div
            v-for="article in articles"
            :key="article.slug"
            class="article-preview"
          >
            <div class="article-meta">
              <nuxt-link
                :to="{
                  name: 'profile',
                  params: { username: article.author.username },
                }"
                ><img :src="article.author.image"
              /></nuxt-link>
              <div class="info">
                <nuxt-link
                  :to="{
                    name: 'profile',
                    params: { username: article.author.username },
                  }"
                  class="author"
                  >{{ article.author.username }}</nuxt-link
                >
                <span class="date">{{
                  article.createdAt | date("MMM DD,YYYY")
                }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{ active: article.favorited }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i> {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              :to="{
                name: 'article',
                params: {
                  slug: article.slug,
                },
              }"
              class="preview-link"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul
                class="tag-list"
                style="float: right; max-width: 50%; vertical-align: top"
              >
                <li
                  class="tag-default tag-pill tag-outline"
                  v-for="(tag, index) in article.tagList"
                  :key="index"
                >
                  {{ tag }}
                </li>
              </ul>
            </nuxt-link>
          </div>

          <!-- 分页器 -->
          <nav>
            <ul class="pagination">
              <li
                v-for="item in totalPage"
                :key="item"
                class="page-item"
                :class="{ active: item === page }"
              >
                <nuxt-link
                  :to="{
                    name: 'home',
                    query: {
                      page: item,
                      tag: $route.query.tag,
                      tab: tab,
                    },
                  }"
                  class="page-link"
                  >{{ item }}</nuxt-link
                >
              </li>
            </ul>
          </nav>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                v-for="tag in tags"
                :key="tag"
                :to="{ name: 'home', query: { tag, tab: 'tag' } }"
                class="tag-pill tag-default"
                >{{ tag }}</nuxt-link
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getArticles,
  getFeedArticles,
  addFavorite,
  deleteFavorite,
} from "@/api/article";
import { getTags } from "@/api/tag";
import { mapState } from "vuex";
export default {
  watchQuery: ["page", "tag", "tab"], // 监听query中的page参数变化，重新执行组建方法（asyncData、fetch、validate、layout、...）
  name: "HomeIndex",
  async asyncData({ query, store }) {
    const page = Number.parseInt(query.page || 1);
    const limit = 10;
    const { tag, tab = "global_feed" } = query;
    const loadArticles =
      store.state.user && tab === "your_feed" ? getFeedArticles : getArticles;
    let loading = true;
    console.log(1)
    const [articleRes, tagRes] = await Promise.all([
      loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag: query.tag,
      }),
      getTags(),
    ]);
    loading = false;
    const { articles, articlesCount } = articleRes.data;
    const { tags } = tagRes.data;

    articles.forEach((article) => (article.favoriteDisabled = false));
    return {
      loading,
      articles,
      articlesCount,
      limit,
      page,
      tags,
      tag,
      tab,
    };
  },
  computed: {
    ...mapState(["user"]),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit);
    },
  },
  methods: {
    async onFavorite(article) {
      article.favoriteDisabled = true;
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug);
        article.favorited = false;
        article.favoritesCount += -1;
      } else {
        // 添加点赞
        await addFavorite(article.slug);
        article.favorited = true;
        article.favoritesCount += 1;
      }
      article.favoriteDisabled = false;
    },
  },
};
</script>

<style>
</style>