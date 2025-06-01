import axios from "axios";
import { CHECK_USERNAME, REGISTER } from "../API";
import { appAxios } from "../apiConfig";
import { setUser } from "../reducers/userSlice";
import { Alert } from "react-native";
import { token_storage } from "../storage";
import { resetAndNavigate } from "../../utils/NavigationUtils";


interface registerData{
    id_token:string,
    email:string,
    userImage:string,
    fullName:string,
    provider:string,
    balance:number,
}

export const refetchUser = () =>async(dispatch:any) =>{
    try {
        const res =await appAxios.get('/user/profile')
        await dispatch(setUser(res.data.user))
    } catch (error) {
        console.log("REFETCH User",error);
                
    }
}

export const register = (data:registerData) => async(dispatch:any)=>{
    try {
        const res = await axios.post(REGISTER,data)

        token_storage.set('access_token',res.data.tokens.access_token)
        token_storage.set('referesh_token',res.data.tokens.referesh_token)

        await dispatch(setUser(res.data.user))
        resetAndNavigate('BottomTab')
    } catch (error:any) {
        Alert.alert('Something gone wrong,Try again.')
        if (axios.isAxiosError(error)) {
            console.error('Axios error details:', error.message);
            // console.error('Axios error response:', error.response);
          } else {
            console.error('Error in register:', error);
          }
    }
}