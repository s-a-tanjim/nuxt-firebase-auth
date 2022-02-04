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
              <label for="login-method">Choose Login Method:</label>
              <select
                name="login-method"
                id="login-method"
                v-model="loginMethod"
              >
                <option value="phone">Phone</option>
                <option value="email">Email</option>
              </select>
            </div>
            <div class="field" v-if="loginMethod == 'email'">
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
            <div class="field" v-if="loginMethod == 'phone'">
              <label class="label">Phone</label>
              <div class="control">
                <input type="text" class="input" name="phone" v-model="phone" />
              </div>
            </div>
            <div class="field" v-if="loginMethod == 'email'">
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
              <button
                type="submit"
                id="recaptcha-container"
                class="button is-dark is-fullwidth"
              >
                Log In
              </button>
            </div>
          </form>
          <div v-if="loginMethod == 'phone'" style="margin-top: 20px">
            <div class="field">
              <label class="label">Verify Code</label>
              <div class="control">
                <input
                  type="text"
                  class="input"
                  name="verifyCode"
                  v-model="verifyCode"
                />
              </div>
            </div>
            <button
              class="button is-dark is-fullwidth"
              @click="verifyPhoneCode"
            >
              Verify Code
            </button>
          </div>

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
  middleware: "guest",
  data() {
    return {
      loginMethod: "phone",
      email: "",
      phone: "",
      verifyCode: "",
      signupWithPhoneError: false,
      sentVerifyCode: false,
      password: "",
      errorMsg: "",
      isLoading: false,
    };
  },
  mounted() {
    window.recaptchaVerifier = new this.$fireModule.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          console.log(response);
        },
      }
    );
  },

  methods: {
    async login() {
      if (this.email) this.loginWithEmail();
      else if (this.phone) {
        if (this.signupWithPhoneError) {
          grecaptcha.reset(window.recaptchaWidgetId);
        }
        this.sendPhoneCode();
      }
    },
    async sendPhoneCode() {
      this.isLoading = true;
      const appVerifier = window.recaptchaVerifier;
      try {
        const confirmationResult = await this.$fire.auth.signInWithPhoneNumber(
          this.phone,
          appVerifier
        );
        window.confirmationResult = confirmationResult;
        this.signupWithPhoneError = false;
      } catch (err) {
        console.log(err);
        this.errorMsg = err.message;
        this.signupWithPhoneError = true;
      } finally {
        this.isLoading = false;
      }
    },
    async verifyPhoneCode() {
      confirmationResult
        .confirm(this.verifyCode)
        .then((result) => {
          // User signed in successfully.
          const user = result.user;
          console.log(user);
          // ...
          this.$router.push("/");
        })
        .catch((err) => {
          console.log(err);
          this.errorMsg = err.message;
          // User couldn't sign in (bad verification code?)
        });
    },
    async loginWithEmail() {
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
      this.phone = "";
      this.isLoading = false;
      this.errorMsg = "";
    },
  },
};
</script>