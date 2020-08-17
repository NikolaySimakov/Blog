<template>
  <div>
    <UserData :name="name" :email="email" :imageURL="imageURL"/>
    <div>
      <b-button
        v-b-modal.add-post-modal
        v-if="userPage()"
        class="mt-3 mb-5"
        variant="primary"
      >+ add post</b-button>
      <div class="d-flex justify-content-center mb-3 m-5" v-if="newPostLoading">
        <b-spinner label="Loading..." variant="primary"></b-spinner>
      </div>

      <b-modal
        id="add-post-modal"
        ref="modal"
        title="Make a post"
        centered
        @show="resetModal"
        @ok="handleOk"
      >
        <b-form ref="form" @submit.stop.prevent="handleSubmit">
          <b-form-group
            :state="post.titleState"
            label="Title"
            label-for="title-input"
            invalid-feedback="Title is required"
          >
            <b-form-input id="title-input" v-model="post.title" :state="post.titleState" required></b-form-input>
          </b-form-group>
          <b-form-group
            :state="post.bodyState"
            label="Post body"
            label-for="body-textarea"
            invalid-feedback="Post body is required"
          >
            <b-form-textarea
                id="body-textarea"
                v-model="post.body"
                :state="post.bodyState"
                rows="3"
                max-rows="6"
                required
              ></b-form-textarea>
          </b-form-group>
          <b-button
            @click="$refs.fileInput2.$el.querySelector('input[type=file]').click()"
            variant="primary"
          >Select post image</b-button>
          <b-form-file v-model="post.image" style="display:none;" ref="fileInput2" />
          <div class="mt-3">Selected image: {{ post.image ? post.image.name : '' }}</div>
        </b-form>
      </b-modal>
    </div>
  </div>
</template>

<script>
import * as fb from "@/firebase";
import UserData from "./UserData.vue"
export default {
  name: "User",
  components: {
    UserData
  },
  data() {
    return {
      post: {
        image: null,
        title: "",
        body: "",
        titleState: null,
        bodyState: null
      },
      newPostLoading: false
    };
  },
  props: {
    name: String,
    email: String,
    imageURL: String
  },
  methods: {
    userPage() {
      return fb.auth.currentUser.uid === this.$route.params.id;
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.post.titleState = valid;
      this.post.bodyState = valid;
      return valid;
    },
    resetModal() {
      this.post = {
        image: null,
        title: "",
        body: "",
        titleState: null,
        bodyState: null
      };
    },
    async handleOk(bvModalEvt) {
      await this.addPost();
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    handleSubmit() {
      if (!this.checkFormValidity()) {
        return;
      }
      this.$nextTick(() => {
        this.$bvModal.hide("add-post-modal");
      });
    },
    addPost() {
      const img = this.post.image;
      const userId = fb.auth.currentUser.uid;
      const imageName = `${userId}_${img.name}`;
      const task = fb.storage
        .ref("postImages")
        .child(imageName)
        .put(img);
      task.on(
        "state_changed",
        snapshot => {
          this.newPostLoading = true;
          let progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        error => {
          console.log("error ", error);
        },
        () => {
          this.newPostLoading = false;
          this.$store.dispatch("addPost", {
            createdAt: new Date(),
            title: this.post.title,
            body: this.post.body,
            userId: userId,
            imageName: img.name
          });
        }
      );
    }
  }
};
</script>
