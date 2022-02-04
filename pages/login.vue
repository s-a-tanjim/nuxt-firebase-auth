<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-4 is-offset-4">
          <h2 class="title has-text-centered">Welcome back!</h2>

          <div v-if="errorMsg" class="notification is-danger">
            {{ errorMsg }}
          </div>

          <form method="post" @submit.prevent="login">
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input
                  type="email"
                  class="input"
                  name="email"
                  v-model="email"
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
                />
              </div>
            </div>
            <div class="control">
              <button type="submit" class="button is-dark is-fullwidth">
                Log In
              </button>
            </div>
          </form>
          <div class="has-text-centered" style="margin-top: 20px">
            <p>
              Don't have an account?
              <nuxt-link to="/register">Register</nuxt-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  middleware: 'guest',
  data() {
    return {
      email: "",
      password: "",
      errorMsg: "",
      isLoading: false,
    };
  },

  methods: {
    async login() {
      this.isLoading = true;
      try {
        const res = await this.$store.dispatch("auth/loginUserWithEmail", {
          email: this.email,
          password: this.password,
        });
        this.errorMsg = "";
        this.isLoading = false;
        this.resetFormData();

        this.$router.push("/");
      } catch (err) {
        this.isLoading = false;

        if (err.message) {
          this.errorMsg = "Invalid Email or Password";
        } else {
          this.$store.commit("handleFirebaseError", {
            error: err,
            from: "login : login()",
          });
        }
      }
    },
    resetFormData() {
      this.email = "";
      this.password = "";
      this.isLoading = false;
      this.errorMsg = "";
    },
  },
};
</script>