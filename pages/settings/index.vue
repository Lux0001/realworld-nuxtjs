<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form>
            <fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                  v-model="userInfo.image"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  v-model="userInfo.username"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                  v-model="userInfo.bio"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                  v-model="userInfo.email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="New Password"
                />
              </fieldset>
              <button
                class="btn btn-lg btn-primary pull-xs-right"
                @click="updateSetting"
                :disabled="updateDisabled"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="logout()">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { updateUser } from "@/api/user";
const Cookie = process.client ? require("js-cookie") : undefined;
export default {
  middleware: "authenticated",
  name: "SettingsIndex",
  data() {
    return {
      updateDisabled: false,
      userInfo: {
        bio: "",
        email: "",
        image: "",
        username: "",
      },
    };
  },
  computed: {},
  created() {
    this.userInfo = {
      bio: this.$store.state.user.bio,
      email: this.$store.state.user.email,
      image: this.$store.state.user.image,
      username: this.$store.state.user.username,
    };
  },
  methods: {
    async updateSetting() {
      this.updateDisabled = true;
      const { data } = await updateUser(this.userInfo);
      this.$store.commit("setUser", data.user);
      this.$router.push("/");
    },
    logout() {
      Cookie.remove("user");
      this.$store.commit("setUser", undefined);
      this.$router.push({ path: "/" });
    },
  },
};
</script>

<style>
</style>