<template>
  <div class="container mt-3" align="left">
    <b-modal :id="'editModal'+docId" title="Edit a post" centered @ok="handleOk()">
      <b-form ref="form" @submit.stop.prevent="handleSubmit">
        <b-form-group label="Title" label-for="title-input" invalid-feedback="Title is required">
          <b-form-input id="title-input" v-model="editForm.title"></b-form-input>
        </b-form-group>
        <b-form-group
          label="Post body"
          label-for="body-textarea"
          invalid-feedback="Post body is required"
        >
          <b-form-textarea id="body-textarea" v-model="editForm.body" rows="3" max-rows="6"></b-form-textarea>
        </b-form-group>
      </b-form>
    </b-modal>
    <b-card
      @click="showSettings()"
      :title="title"
      :img-src="imageURL"
      img-alt="postImage"
      img-top
      tag="article"
      class="mb-2"
    >
      <b-card-text>{{body}}</b-card-text>
      <div v-if="cardHandler" align="right">
        <b-button
          class="mr-2"
          variant="primary"
          @click="editTapped()"
          v-b-modal="'editModal'+docId"
        >Edit</b-button>
        <b-button variant="danger" @click="deleteTapped()">Delete</b-button>
      </div>
    </b-card>
  </div>
</template>

<script>
import * as fb from "@/firebase";
export default {
  name: "Post",
  data() {
    return {
      cardHandler: false,
      pageOwner: false,
      imageURL: "",
      editForm: {
        title: "",
        body: ""
      }
    };
  },
  props: {
    title: String,
    body: String,
    userId: String,
    imageName: String,
    docId: String
  },
  created() {
    fb.storage
      .ref()
      .child("postImages")
      .child(`${this.userId}_${this.imageName}`)
      .getDownloadURL()
      .then(url => {
        this.imageURL = url;
      });
    if (fb.auth.currentUser.uid === this.userId) {
      this.pageOwner = true;
    }
  },
  methods: {
    async handleOk(bvModalEvt) {
      await this.editPost();
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    async editPost() {
      await this.$store.dispatch('editPost', {
        docId: this.docId,
        values: {
          title: this.editForm.title,
          body: this.editForm.body
        }
      })
    },
    showSettings() {
      if (this.pageOwner) {
        this.cardHandler = !this.cardHandler;
      }
    },
    editTapped() {
      this.editForm = {
        title: this.title,
        body: this.body,
        imageName: this.imageName,
        image: null
      };
    },
    deleteTapped() {
      const imgRef = fb.storage
        .ref()
        .child("postImages")
        .child(`${this.userId}_${this.imageName}`);
      imgRef
        .delete()
        .then(() => {
          this.$store.dispatch("deletePost", this.docId);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 640px;
}
</style>