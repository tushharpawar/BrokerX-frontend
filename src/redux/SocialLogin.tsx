// import {Alert} from 'react-native'
// import {resetAndNavigate, navigate} from '../utils/NavigationUtils'
// import {setUser} from './reducers/userSlice'
// import {token_storage} from './storage'
// import {GoogleSignin} from '@react-native-google-signin/google-signin'
// import axios from 'axios'
// import {LOGIN} from './API'
// import {
//   LoginManager,
//   AccessToken,
//   GraphRequest,
//   GraphRequestManager,
// } from 'react-native-fbsdk'

// interface RegisterData {
//   id_token: string
//   provider: string
//   name: string
//   email: string
//   userImage: string
// }

// const handleSignInSuccess = async (res: any, dispatch: any) => {
//   token_storage.set('access_token', res.data.tokens.access_token)
//   token_storage.set('referesh_token', res.data.tokens.referesh_token)

//   await dispatch(setUser(res.data.user))
//   resetAndNavigate('BottomTab')
// }

// const handleSignInError = (error: any, data: RegisterData) => {
//   console.log('Error in social login', error)
//   if (error) {
//     navigate("RegisterScreen", {
//       ...data,
//     })
//     return
//   }

//   Alert.alert('Sorry , we are facing some issue, please try again later.')
// }

// export const signInWithGoogle = () => async (dispatch: any) => {
//   try {
//     await GoogleSignin.hasPlayServices()
//     await GoogleSignin.signOut()
//     const {idToken, user} = await GoogleSignin.signIn()
//     await axios
//       .post(LOGIN, {
//         provider: 'google',
//         id_token: idToken,
//       })
//       .then(async (res) => {
//         await handleSignInSuccess(res, dispatch)
//       })
//       .catch((err: any) => {
//         const errorData = {
//           email: user?.email,
//           name: user?.name,
//           userImage: user?.photo,
//           provider: 'google',
//           id_token: idToken,
//         }
//         handleSignInError(err, errorData as RegisterData)
//       })
//   } catch (error) {
//     console.log('Google signin error.', error)
//   }
// }

// export const signInWithFacebook = () => async (dispatch: any) => {
//   LoginManager.logOut()
//   LoginManager.logInWithPermissions(['email', 'public_profile']).then(
//     (result) => {
//       if (result.isCancelled) {
//         console.log('User cancelled the login');
//         return;
//       } else {
//         AccessToken.getCurrentAccessToken().then(async (data: any) => {
//           const infoRequest = new GraphRequest(
//             '/me?field=name,picture,email',
//             null,
//             async (err: any, result: any) => {
//               if (err) {
//                 Alert.alert('Facebook Login error')
//                 return
//               }
//               console.log(result, err)

//               await axios
//                 .post(LOGIN, {
//                   provider: 'facebook',
//                   id_token: data?.accessToken,
//                 })
//                 .then(async (res) => {
//                   await handleSignInSuccess(res, dispatch)
//                 })
//                 .catch((err: any) => {
//                   const errorData = {
//                     email: result?.email,
//                     name: result?.name,
//                     userImage: result?.picture?.data?.url,
//                     provider: 'facebook',
//                     id_token: data?.accessToken,
//                   }
//                   handleSignInError(err, errorData)
//                 })
//             },
//           )
//           new GraphRequestManager().addRequest(infoRequest).start()
//         })
//       }
//     },
//     error => {
//       console.log('fb error', error)
//     },
//   )
// }
