export const state = () => ({
  user: null,
})
/*
export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION: (state, {
    authUser,
    claims
  }) => {
    //console.log("Mutation -auth");
    //console.log(authUser);
    if (!authUser) return;
    const {
      uid,
      email,
      emailVerified
    } = authUser
    state.user = {
      uid,
      email,
      emailVerified
    }
  }
} */

export const actions = {
  async registerUserWithEmail({
    commit
  }, authData) {
    let user = null

    try {
      await this.$fire.auth.createUserWithEmailAndPassword(authData.email, authData.password)
      user = this.$fire.auth.currentUser
      await user.updateProfile({
        displayName: authData.username
      })

    } catch (err) {
      if (user) user.delete()
      throw err
    }
  },
  async registerUserWithPhone({
    commit
  }, authData) {
    let user = null

    try {
      await this.$fire.auth.signInWithPhoneNumber(authData.phone, authData.verifier)
      user = this.$fire.auth.currentUser
      await user.updateProfile({
        displayName: authData.username
      })

    } catch (err) {
      if (user) user.delete()
      throw err
    }
  },
  async loginUserWithEmail({
    commit
  }, authData) {
    try {
      const authUser = await this.$fire.auth
        .signInWithEmailAndPassword(authData.email, authData.password)

      /*if (!authUser.emailVerified && window.location.pathname !== '/verify') {
        this.$router.push('/verify')
      }*/
    } catch (err) {
      throw err
    }
  },
  onAuthStateChangedAction(ctx, {
    authUser,
    claims
  }) {
    console.log('Action | onAuthStateChangedAction | called!')
    console.log(authUser)

    if (!authUser) {
      // claims = null
      // Perform logout operations
      ctx.commit('resetUserInfo', null, {
        root: true,
      })
    } else {
      // # Store JWT token and set axios Authorization header
      ctx.commit(
        'setJWTInfo', {
          JWTToken: authUser.za,
          refreshToken: authUser.refreshToken,
        }, {
          root: true,
        }
      )

      // Store user info from firebase
      ctx.commit('setFirebaseInfo', authUser, {
        root: true,
      })

      // If user signed in but not email verified and not in verify page
      if (!authUser.emailVerified && window.location.pathname !== '/verify') {
        /* this.$router.replace({
          path: '/verify'
        }); */
        // if($nuxt.$route.path)
        // location.replace('/verify');
        // this.$router.push('/verify');
      }
      // If user signend in and email verified but in verify poae
      /*if (authUser.emailVerified && window.location.pathname === '/verify') {
        location.replace('/')
      }*/
    }
  },
  async verifyUserEmail() {
    const user = this.$fire.auth.currentUser
    try {
      return await user.sendEmailVerification()
    } catch (err) {
      throw err
    }
  },
  async getJWT({
    commit,
    dispatch
  }) {
    try {
      const idToken = await this.$fire.auth
        .currentUser.getIdToken( /* forceRefresh */ true)
      commit(
        'setJWTInfo', {
          JWTToken: idToken,
        }, {
          root: true,
        }
      )
      /* await dispatch('getUserData', null, {
        root: true
      }); */
    } catch (error) {
      console.log('getJWT error')
      console.log(error)
    }
  },
  logoutUser({
    commit
  }) {
    this.$fire.auth.signOut()
    sessionStorage.clear()
    commit('resetUserInfo', null, {
      root: true,
    })
    this.$router.push('/')
    this.$router.app.refresh()
  },
}
