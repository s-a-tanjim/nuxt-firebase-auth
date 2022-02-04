export default function ({
  store,
  redirect
}) {
  console.log("Guest Middleware: " + store.getters.isAuthenticated)
  if (store.getters.isAuthenticated) {
    return redirect('/')
  }
}
