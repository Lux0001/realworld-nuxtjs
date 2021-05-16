<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="userInfo.image" class="user-img" />
            <h4>{{ userInfo.username }}</h4>
            <!-- <p>
              Cofounder @GoThinkster, lived in Aol's HQ for a few months, kinda
              looks like Peeta from the Hunger Games
            </p> -->
            <template v-if="userInfo.username === $store.state.user.username">
              <nuxt-link
                :to="{ name: 'settings' }"
                class="btn btn-sm btn-outline-secondary action-btn"
              >
                <i class="ion-gear-a"></i>
                &nbsp; Edit Profile Settings
              </nuxt-link>
            </template>
            <template v-else>
              <button
                class="btn btn-sm btn-outline-secondary action-btn"
                :disabled="followDisabled"
                @click="onfollow"
              >
                <i class="ion-plus-round"></i>
                &nbsp;
                <span v-if="userInfo.following">Unfollow </span>
                <span v-else>Follow </span>{{ userInfo.username }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link class="nav-link" exact :to="{ name: 'profile' }"
                  >My Articles</nuxt-link
                >
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  exact
                  :to="{ name: 'profile', query: { tab: 'favorite' } }"
                  >Favorited Articles</nuxt-link
                >
              </li>
            </ul>
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
            </nuxt-link>
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
          </div>
          <template v-if="loading">
            <p>loading articles...</p>
          </template>
          <template v-else>
            <p v-if="articles.length == 0">No articles are here... yet.</p>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUser, followUser, unFollowUser } from "@/api/user";
import { getArticles } from "@/api/article";
export default {
  middleware: "authenticated",
  name: "UserProfile",
  head() {
    return {
      title: `${this.$route.params.username} - RealWorld`,
      meta: [
        {
          hid: "presonal homepage", // 为meta标签添加唯一标识编号
          name: "presonal homepage",
          content: this.$route.params.username,
        },
      ],
    };
  },
  data() {
    return {
      tab: "",
      userInfo: {},
      articles: [],
      loading: true,
      followDisabled: false,
    };
  },
  computed: {},
  async created() {
    this.userInfo.username = this.$route.params.username;
    const { data } = await getUser(this.userInfo.username);
    const { profile } = data;
    this.userInfo = {
      bio: profile.bio,
      following: profile.following,
      image: profile.image,
      username: profile.username,
    };
    this.getMyArticles();
  },
  methods: {
    async getMyArticles() {
      this.tab = "";
      this.loading = true;
      this.articles = [];
      const { data } = await getArticles({
        limit: 20,
        author: this.userInfo.username,
      });
      this.articles = data.articles;
      this.loading = false;
    },
    async getMyFavoriteArticles() {
      this.tab = "favorite";
      this.loading = true;
      this.articles = [];
      const { data } = await getArticles({
        limit: 20,
        favorited: this.userInfo.username,
      });
      this.articles = data.articles;
      this.loading = false;
    },
    async onfollow() {
      this.followDisabled = true;
      const follow = this.userInfo.following ? unFollowUser : followUser;
      const { data } = await follow(this.userInfo.username);
      this.userInfo.following = data.profile.following;
      this.followDisabled = false;
    },
  },
  watch: {
    $route() {
      this.tab = this.$route.query.tab;
      this.userInfo.username = this.$route.params.username;
    },
    tab() {
      if (this.tab === "favorite") this.getMyFavoriteArticles();
      else this.getMyArticles();
    },
  },
};
</script>

<style>
</style>