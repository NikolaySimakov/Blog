<template>
  <div class="mt-3">
    <img
      v-if="userPage()"
      v-bind="profileImageProps"
      v-b-modal.userpic-modal
      class="rounded-circle"
      :src="imgURL"
      alt="Profile photo"
    />
    <img
      v-else
      v-bind="profileImageProps"
      class="rounded-circle"
      :src="imageURL"
      alt="Profile photo"
    />

    <b-modal
      id="userpic-modal"
      ref="modal"
      title="Change user image"
      centered
      @show="resetModal"
      @hidden="resetModal"
      @ok="handleOk"
    >
      <b-form ref="form" @submit.stop.prevent="handleSubmit">
        <b-button
          @click="$refs.fileInput2.$el.querySelector('input[type=file]').click()"
          variant="primary"
        >Select userpic image</b-button>
        <b-form-file v-model="newUserpic" style="display:none;" ref="fileInput2" />
        <div class="mt-3">Selected image: {{ newUserpic ? newUserpic.name : '' }}</div>
      </b-form>
    </b-modal>

    <h2 class="mt-3">{{name}}</h2>
    <h5 class="mt-3">{{email}}</h5>
  </div>
</template>

<script>
import * as fb from "@/firebase";
export default {
  name: "UserData",
  data() {
    return {
      profileImageProps: {
        blank: true,
        blankColor: "#777",
        width: 80,
        height: 80,
        class: "m1"
      },
      newUserpic: null,
      imgURL: ''
    };
  },
  watch: {
    imageURL() {
      this.imgURL = this.imageURL
    }
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
    resetModal() {
      this.newUserpic = null;
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.handleSubmit();
    },
    handleSubmit() {
      this.changeUserpic();
      this.$nextTick(() => {
        this.$bvModal.hide("userpic-modal");
      });
    },
    changeUserpic() {
      const user = fb.auth.currentUser;
      const userId = user.uid;
      const task = fb.storage
        .ref("userPictures")
        .child(userId)
        .put(this.newUserpic);
      task.on(
        "state_changed",
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        error => {
          console.log("error ", error);
        },
        () => {
          fb.storage
            .ref("userPictures")
            .child(userId)
            .getDownloadURL()
            .then(imgUrl => {
              fb.users.doc(userId).update({ imageURL: imgUrl});
              this.imgURL = imgUrl
            });
        }
      );
    }
  }
};
</script>
