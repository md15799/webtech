export default function ({ store, error }) {
  if (!store.state.authUser) {
    error({
      message: 'You are not connected',
      statusCode: 403
    })
  }
//   if (store.state.auth) {
//     return redirect('/tree')
//   }
//   if (!store.state.auth) {
//     return redirect('/login')
//   }
// }
}
