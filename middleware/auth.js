export default function ({
  store,
  redirect
}) {
  console.log("Auth Middleware: " + store.getters.isAuthenticated)
  if (!store.getters.isAuthenticated) {
    return redirect('/login')
  }
}
