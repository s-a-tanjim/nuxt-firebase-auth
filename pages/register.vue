<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Register!</h2>

          <div v-if="errorMsg" class="notification is-danger">
            {{ errorMsg }}
          </div>

          <form method="post" @submit.prevent="registerClicked">
            <div class="field">
              <label class="label">Username</label>
              <div class="control">
                <input
                  type="text"
                  class="input"
                  name="username"
                  v-model="username"
                  required
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input
                  type="email"
                  class="input"
                  name="email"
                  v-model="email"
                  required
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Mobile Phone</label>
              <div class="control">
                <input
                  type="text"
                  class="input"
                  name="phone"
                  v-model="phone"
                  required
                />
              </div>
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input
                  type="password"
                  class="input"
                  name="password"
                  v-model="password"
                  required
                />
              </div>
            </div>
            <div class="control">
              <button type="submit" class="button is-dark is-fullwidth">
                Register
              </button>
            </div>
          </form>

          <div class="has-text-centered" style="margin-top: 20px">
            Already got an account? <nuxt-link to="/login">Login</nuxt-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  middleware: "guest",
  data() {
    return {
      username: "",
      email: "",
      phone: "",
      password: "",
      errorMsg: "",
      isLoading: false,
    };
  },

  methods: {
    registerClicked() {
      if (this.email && !this.phone) {
        this.registerWithEmail();
      } else if (this.phone) {
        //Phone login
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
          "sign-in-button",
          {
            size: "invisible",
            callback: (response) => {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
              registerWithPhone();
            },
          }
        );
      }
    },
    async registerWithEmail() {
      this.isLoading = true;
      this.errorMsg = "";
      try {
        let res = await this.$store.dispatch("auth/registerUserWithEmail", {
          username: this.username,
          email: this.email,
          password: this.password,
        });

        this.resetFormData();
        this.$router.push("/");
      } catch (err) {
        this.isLoading = false;
        this.errorMsg = err.message;
        if (err.message) this.errorMsg = err.message;
        else
          this.$store.commit("handleFirebaseError", {
            error: err,
            from: "register : registerWithEmail()",
          });
      }
    },
    async registerWithPhone() {
      this.isLoading = true;
      this.errorMsg = "";
      try {
        let res = await this.$store.dispatch("auth/registerUserWithPhone", {
          username: this.username,
          phone: this.phone,
          password: this.password,
          verifier:window.recaptchaVerifier
        });

        this.resetFormData();
        this.$router.push("/");
      } catch (err) {
        this.isLoading = false;
        this.errorMsg = err.message;
        if (err.message) this.errorMsg = err.message;
        else
          this.$store.commit("handleFirebaseError", {
            error: err,
            from: "register : registerWithPhone()",
          });
      }
    },
    resetFormData() {
      this.username = "";
      this.email = "";
      this.password = "";

      this.isLoading = false;
      this.errorMsg = "";
    },
  },
};
</script>