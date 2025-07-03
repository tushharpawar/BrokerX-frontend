import {Alert} from 'react-native'
import {navigate, resetAndNavigate} from '../utils/NavigationUtils'
import {setUser, clearUser} from './reducers/userSlice'
import {setStocks} from './reducers/stockSlice'
import {setHoldings} from './reducers/holdingSlice'
import {token_storage} from './storage'
import {GoogleSignin} from '@react-native-google-signin/google-signin'
import axios from 'axios'
import {LOGIN} from './API'
import {persistor} from './store'

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

export const signOutUser = () => async (dispatch: any) => {
  try {
    // Sign out from Google
    await GoogleSignin.signOut()
    
    // Clear tokens from storage
    token_storage.delete('access_token')
    token_storage.delete('referesh_token')
    
    // Clear all Redux state
    dispatch(clearUser())
    dispatch(setStocks([]))
    dispatch(setHoldings([]))
    
    // Purge persisted data
    await persistor.purge()
    
    // Navigate to login screen
    resetAndNavigate('LoginScreen')
    
    console.log('User signed out successfully')
  } catch (error) {
    console.log('Error during sign out:', error)
    // Even if Google signout fails, still clear local data and navigate
    token_storage.delete('access_token')
    token_storage.delete('referesh_token')
    dispatch(clearUser())
    dispatch(setStocks([]))
    dispatch(setHoldings([]))
    
    // Try to purge persisted data even on error
    try {
      await persistor.purge()
    } catch (purgeError) {
      console.log('Error purging persistor:', purgeError)
    }
    
    resetAndNavigate('LoginScreen')
  }
}

