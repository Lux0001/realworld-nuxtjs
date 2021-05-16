<template>
  <div class="article-meta">
    <nuxt-link
      :to="{ name: 'profile', params: { username: article.author.username } }"
      ><img :src="article.author.image"
    /></nuxt-link>
    <div class="info">
      <nuxt-link
        class="author"
        :to="{ name: 'profile', params: { username: article.author.username } }"
        >{{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createdAt | date("MMM DD,YYYY") }}</span>
    </div>

    <template v-if="article.author.username === $store.state.user.username">
      <nuxt-link
        class="btn btn-sm btn-outline-secondary"
        :class="{ active: article.author.following }"
        :to="{
          name: 'editor',
          query: {
            slug: this.article.slug,
          },
          params: {
            article,
          },
        }"
      >
        <i class="ion-edit"></i>&nbsp;Edit Article
      </nuxt-link>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary btn-outline-danger"
        @click="removeArticle"
      >
        <i class="ion-trash-a"></i>&nbsp;Delete Article
      </button>
    </template>
    <template v-else>
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{ active: article.author.following }"
        :disabled="followDisabled"
        @click="subscribeUser"
      >
        <i class="ion-plus-round"></i>
        &nbsp;
        <span v-if="article.author.following">Follow</span>
        <span v-else>Unfollow</span>{{ article.author.username }}
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{ active: article.favorited }"
        :disabled="followDisabled"
        @click="onFavorite"
      >
        <i class="ion-heart"></i>
        &nbsp; Favorite Post
        <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
  </div>
</template>

<script>
import { followUser, unFollowUser } from "@/api/user";
import { addFavorite, deleteFavorite, deleteArticle } from "@/api/article";
export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      followDisabled: false,
      favoriteDisabled: false,
    };
  },
  methods: {
    async subscribeUser() {
      this.followDisabled = true;
      const subscrib = this.article.author.following
        ? unFollowUser
        : followUser;
      const { data } = await subscrib(this.article.author.username);
      this.article.author.following = data.profile.following;
      this.followDisabled = false;
    },
    async onFavorite() {
      const article = this.article;
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
    removeArticle() {
      deleteArticle(this.article.slug);
      this.$router.go(-1);
    },
  },
};
</script>

<style>
</style>