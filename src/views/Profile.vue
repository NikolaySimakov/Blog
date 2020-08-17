<template>
  <div>
    <div>
      <b-navbar type="light">
        <div class="container collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mr-auto">
            <b-navbar-brand tag="h1" class="mb-0" :href="myURL()">Simple blog</b-navbar-brand>
          </ul>
          <b-row class="navbar-nav" align-v="center">
            <b-button to="/signin" class="mr-4" @click="logout()" pill variant="primary">Logout</b-button>
            <img
              class="mr-3"
              src="https://image.flaticon.com/icons/svg/1828/1828551.svg"
              alt="menu"
              v-b-toggle.sidebar-right
              height="30"
            />
            <b-sidebar id="sidebar-right" title="Find user" right shadow>
              <div class="px-3 py-2">
                <b-input
                  type="text"
                  class="mr-4"
                  style="border-radius: 20px;"
                  v-model="search"
                  @keyup.enter.native="searchUserByName()"
                ></b-input>
                <div class="pt-3">
                  <div
                    v-for="{name, url} in $store.getters.recentlySearched"
                    :key="url"
                    class="my-2"
                  >
                    <router-link :to="'/user/'+url">{{name}}</router-link>
                  </div>
                </div>
              </div>
            </b-sidebar>
          </b-row>
        </div>
      </b-navbar>
    </div>
    <User :name="profile.name" :email="profile.email" :imageURL="profile.imageURL" />
    <div v-if="loadingPosts">
      <div class="d-flex justify-content-center mb-3 m-5">
        <b-spinner label="Loading..." variant="primary"></b-spinner>
      </div>
    </div>
    <div v-else>
      <b-container v-if="posts.length === 0">
        <h2>No content</h2>
        <p>Please, add some post!</p>
      </b-container>
      <b-container v-else>
        <Post
          v-for="{title, body, userId, imageName, docId} in posts"
          :key="docId"
          :title="title"
          :body="body"
          :docId="docId"
          :userId="userId"
          :imageName="imageName"
        />
      </b-container>
    </div>
    <hr class="mt-5" />
    <p>
      Simple blog on
      <a href="https://vuejs.org/">vue.js</a> for
      <a href="https://github.com/">github</a>
    </p>
  </div>
</template>

<script>
import Post from "@/components/Post.vue";
import User from "@/components/User.vue";
import { mapState } from "vuex";
import * as fb from "@/firebase";

export default {
  name: "Profile",
  components: {
    Post,
    User
  },
  computed: {
    ...mapState(["posts"])
  },
  watch: {
    posts() {
      this.loadingPosts = false;
    },
    async $route() {
      await this.loadData();
    }
  },
  data() {
    return {
      search: "",
      loadingPosts: true,
      profile: {
        name: "",
        email: "",
        imageURL: ""
      }
    };
  },
  async mounted() {
    await this.loadData();
  },
  methods: {
    async searchUserByName() {
      fb.users
        .where("name", "==", this.search)
        .get()
        .then(snapshot => {
          snapshot.forEach(doc => {
            this.$router.push(`/user/${doc.id}`);
            this.$store.dispatch("recentlySearchedUsers", {
              name: this.search,
              url: doc.id
            });
            this.search = "";
          });
        });
    },
    async loadData() {
      if (this.$router.currentRoute.path === "/")
        this.$router.push(this.myURL());
      const uid = this.$route.params.id;
      await fb.users
        .doc(uid)
        .get()
        .then(doc => {
          if (doc.exists) {
            this.profile = doc.data();
            this.$store.dispatch("getPosts", uid);
          }
        });
    },
    myURL() {
      return `/user/${fb.auth.currentUser.uid}`;
    },
    logout() {
      this.$store.dispatch("logout");
    }
  }
};
</script>

<style>
:focus {
  outline: none !important;
}
::-moz-focus-inner {
  border: 0px !important;
}
.con {
  max-width: 720px;
}
</style>