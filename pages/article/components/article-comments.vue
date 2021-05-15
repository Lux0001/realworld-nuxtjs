<template>
  <div>
    <form class="card comment-form">
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          v-model="comment"
        ></textarea>
      </div>
      <div class="card-footer">
        <img src="http://i.imgur.com/Qr71crq.jpg" class="comment-author-img" />
        <button
          type="button"
          class="btn btn-sm btn-primary"
          @click="releaseComment"
        >
          Post Comment
        </button>
      </div>
    </form>

    <div class="card" v-for="comment in comments" :key="comment.id">
      <div class="card-block">
        <p class="card-text">
          {{ comment.body }}
        </p>
      </div>
      <div class="card-footer">
        <nuxt-link
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username,
            },
          }"
          class="comment-author"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username,
            },
          }"
          class="comment-author"
        >
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{
          comment.createdAt | date("MMM DD,YYYY")
        }}</span>
        <span
          class="mod-options"
          v-if="comment.author.username === $store.state.user.username"
          @click="deleteMyComment(comment.id)"
        >
          <i class="ion-trash-a"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getComments, addComment, deleteComment } from "@/api/article";
export default {
  name: "articleComments",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      comments: [], // 文章评论列表
      comment: "",
    };
  },
  async mounted() {
    const { data } = await getComments(this.article.slug);
    this.comments = data.comments;
  },
  methods: {
    async releaseComment() {
      await addComment(this.article.slug, this.comment);
      this.comment = "";
      const { data } = await getComments(this.article.slug);
      this.comments = data.comments;
    },
    async deleteMyComment(id) {
      await deleteComment(this.article.slug, id);
      const { data } = await getComments(this.article.slug);
      this.comments = data.comments;
    },
  },
};
</script>

<style>
</style>