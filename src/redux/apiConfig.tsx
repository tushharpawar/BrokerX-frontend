import axios from 'axios'
import { BASE_URL, REFRESH_TOKEN } from './API'
import { token_storage } from './storage'
import { Alert } from 'react-native'
import { resetAndNavigate } from '../utils/NavigationUtils'

export const appAxios = axios.create({
    baseURL:BASE_URL
})

appAxios.interceptors.request.use(
    async config =>{
        const access_token = token_storage.getString('access_token')
        if(access_token){
            config.headers.Authorization = `Bearer ${access_token}`
        }
        return config;
    }
)

appAxios.interceptors.response.use(
    response => response,
    async error =>{
        if(error.response && error.response.status === 401){
            try {
                const newAccessToken = await referesh_tokens()

                if(newAccessToken){
                    error.config.header.Authorization = `Bearer ${newAccessToken}`
                    return error.config
                }
            } catch (error) {
                console.log("Error in apiConfig Refresh token");
                
            }
        }

        if(error.response && error.response != 401){
            const errorMessage = error.response.data.message || 'Something went wrong.'
            Alert.alert(errorMessage)
        }
        return Promise.resolve(error)
    }
)


export const referesh_tokens=async ()=>{
    try {
        const referesh_token = token_storage.getString('referesh_token')
        const response = await axios.post(REFRESH_TOKEN,{
            referesh_token
        })

        const new_access_token = response.data.access_token
        const new_referesh_token = response.data.referesh_token

        token_storage.set('access_token',new_access_token)
        token_storage.set('referesh_token',new_referesh_token)

        return new_access_token
    } catch (error) {
        console.log("Error",error);
        token_storage.clearAll()
        resetAndNavigate('/LoginScreen')
    }
}