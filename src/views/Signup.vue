<template>
  <div style="height: 100vh;">
    <b-container class="h-100">
      <b-row class="align-items-center h-100">
        <div class="container mx-auto justify-content-center px-3" align="center">
          <b-card class="align">
            <div v-if="errorMessage !== ''">
              <b-alert show variant="danger">{{errorMessage}}</b-alert>
            </div>
            <b-form-group label="Username">
              <b-form-input v-model.trim="form.name" type="text" required></b-form-input>
            </b-form-group>
            <b-form-group label="Email address">
              <b-form-input v-model.trim="form.email" type="email" required></b-form-input>
            </b-form-group>
            <b-form-group label="Password">
              <b-form-input v-model.trim="form.password" type="password" required></b-form-input>
            </b-form-group>
            <b-form-group label="Password re-type">
              <b-form-input v-model.trim="form.password_rt" type="password" required></b-form-input>
            </b-form-group>
            <p class="text-center mt-2 mb-4">
              Have an account?
              <router-link to="/signin">Sign in!</router-link>
            </p>
            <div class="btn-align">
              <b-button type="button" @click="onSubmit()" variant="dark">Sign up</b-button>
            </div>
          </b-card>
        </div>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
        password_rt: ""
      },
      errorMessage: ""
    };
  },
  methods: {
    async onSubmit() {
      if (this.form.password === this.form.password_rt) {
        this.errorMessage = await this.$store.dispatch("signup", {
          email: this.form.email,
          password: this.form.password,
          name: this.form.name,
          imageURL: "https://image.flaticon.com/icons/svg/565/565452.svg"
        });
      } else {
        this.errorMessage = "Password mismatch!";
      }
    }
  }
};
</script>

<style scoped>
.align {
  max-width: 450px;
}
@media screen and (max-width: 499px) {
  .btn {
    width: 100%;
  }
}
@media screen and (min-width: 500px) {
  .align {
    text-align: start;
  }
  .btn-align {
    text-align: end;
  }
}
</style>
