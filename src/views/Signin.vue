<template>
  <div style="height: 100vh;">
    <b-container class="h-100">
      <b-row class="align-items-center h-100">
        <div class="container mx-auto justify-content-center px-3" align="center">
          <b-card class="my-card">
            <div v-if="errorMessage !== ''">
              <b-alert show variant="danger">{{errorMessage}}</b-alert>
            </div>
            <b-form-group id="input-group-1" label="Email address" label-for="input-1">
              <b-form-input id="input-1" v-model="form.email" type="email" required></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-2" label="Password" label-for="input-1">
              <b-form-input id="input-2" v-model="form.password" type="password" required></b-form-input>
            </b-form-group>
            <p class="text-center mt-2 mb-4">
              Don't have an account?
              <router-link to="/signup">Sign up!</router-link>
            </p>
            <div class="btn-align">
              <b-button @click="onSubmit()" class="btn" type="submit" variant="dark" to="/">Sign in</b-button>
            </div>
          </b-card>
        </div>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { auth } from "@/firebase";
export default {
  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      errorMessage: ""
    };
  },
  methods: {
    async onSubmit() {
      await auth
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        .then(() => {
          this.$router.push("/");
        })
        .catch(error => {
          this.errorMessage = error.message;
        });
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
.my-card {
  max-width: 450px;
}
@media screen and (max-width: 499px) {
  .btn {
    width: 100%;
  }
}
@media screen and (min-width: 500px) {
  .my-card {
    text-align: start;
  }
  .btn-align {
    text-align: end;
  }
}
</style>
