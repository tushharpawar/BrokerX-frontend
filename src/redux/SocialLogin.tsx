import {Alert} from 'react-native'
import {navigate, resetAndNavigate} from '../utils/NavigationUtils'
import {setUser} from './reducers/userSlice'
import {token_storage} from './storage'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import axios from 'axios'
import {LOGIN} from './API'

interface RegisterData {
  id_token: string
  provider: string
  fullName: string
  email: string
  userImage: string
}

const handleSignInSuccess = async (res: any, dispatch: any) => {

  console.log('Sign-in successful== :', res)

  token_storage.set('referesh_token', res.data.tokens.refresh_token)
  token_storage.set('access_token', res.data.tokens.access_token)

  await dispatch(setUser(res.data.user))
  resetAndNavigate('BottomTab')
}

const handleSignInError = (error: any, data: RegisterData) => {
  console.log('Error in social login', error)
  if (error) {
    navigate("LoginScreen", {
      ...data,
    })
    return
  }
  Alert.alert('Sorry , we are facing some issue, please try again later.')
}

export const signInWithGoogle = () => async (dispatch: any) => {
  try {
    await GoogleSignin.hasPlayServices()
    await GoogleSignin.signOut()
    const res = await GoogleSignin.signIn()

    await axios
      .post(LOGIN, {
        provider: 'google',
        id_token: res.data?.idToken,
        fullName:  res.data?.user?.name,
        userImage: res.data?.user?.photo,
      })
      .then(async (res) => {
        await handleSignInSuccess(res, dispatch)
      })
      .catch((err: any) => {
        const errorData = {
          email: res.data?.user?.email,
          fullName:  res.data?.user?.name,
          userImage: res.data?.user?.photo,
          provider: 'google',
          id_token: res.data?.idToken,
        }
        handleSignInError(err, errorData as RegisterData)
      })
  } catch (error) {
    console.log('Google signin error.', error);
    Alert.alert('Google Sign-In failed. Please try again.')
  }
}

