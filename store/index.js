export const state = () => ({
  JWTToken: null,
  refreshToken: null,
  loginCheck: false,
  userInfo: {
    username: '',
    email: '',
    firebase_uid: ''
  },
  verifiedUserEmail: false,

  errorLog: '',
  showErrorMsg: false
});

export const getters = {
  isAuthenticated(state) {
    return state.loginCheck
  },

  loggedInUser(state) {
    return state.userInfo
  }
}

export const mutations = {
  setFirebaseInfo: (state, data) => {
    state.userInfo.username = data.displayName
    state.userInfo.email = data.email
    state.userInfo.firebase_uid = data.uid
    state.verifiedUserEmail = data.emailVerified
    state.loginCheck = true
  },
  setJWTInfo(state, data) {
    state.JWTToken = data.JWTToken
    state.refreshToken = data.refreshToken
    //this.$axios.defaults.headers.common.Authorization =
    //  'Bearer ' + data.JWTToken
  },
  resetUserInfo: (state) => {
    state.JWTToken = null
    state.refreshToken = null
    state.loginCheck = false
    state.verifiedUserEmail = false

    state.userInfo.username = ''
    state.userInfo.email = ''
    state.userInfo.firebase_uid = ''
  },
  handleError: (state, log) => {
    state.errorLog = log
    state.showErrorMsg = true
  },
  handleFirebaseError: (state, log) => {
    state.errorLog = log
    state.showErrorMsg = true
  },
}


export const actions = {
  initialCall({
    commit,
    dispatch,
    getters
  }) {
    // dispatch("getCategoryData");
    // console.log("Store: initialCall: ", getters.getUserInfo.userInfo.userName);
    // if (getters.getLoginCheckData && getters.getUserInfo.userInfo.userName == "") {
    // console.log("Store: LoginCheck True");
    // }
    // console.log("Store: LoginCheck False");
  },
}
