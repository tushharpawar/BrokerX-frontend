// import axios from "axios";
// import { CHECK_USERNAME, REGISTER } from "../API";
// import { appAxios } from "../apiConfig";
// import { setUser } from "../reducers/userSlice";
// import { Alert } from "react-native";
// import { token_storage } from "../storage";
// import { resetAndNavigate } from "../utils/NavigationUtil";


// interface registerData{
//     id_token:string,
//     email:string,
//     bio:string,
//     userImage:string,
//     name:string,
//     provider:string,
//     username:string
// }

// export const refetchUser = () =>async(dispatch:any) =>{
//     try {
//         const res =await appAxios.get('/user/profile')
//         await dispatch(setUser(res.data.user))
//     } catch (error) {
//         console.log("REFETCH User",error);
                
//     }
// }

// export const checkUsernameAvailability =(username:string)=> async(dispatch:any) =>{
//     try {
//         const res = await axios.post(CHECK_USERNAME,{
//             username
//         })

//         return res.data.available;
//     } catch (error) {
//         if (axios.isAxiosError(error)) {
//             console.error('Axios error details:', error.message);
//             console.error('Axios error response:', error.response);
//             console.error('Axios error config:', error.config);
//           } else {
//             console.error('General error:', error);
//           }
//     }
// }

// export const register = (data:registerData) => async(dispatch:any)=>{
//     try {
//         const res = await axios.post(REGISTER,data)

//         token_storage.set('access_token',res.data.tokens.access_token)
//         token_storage.set('referesh_token',res.data.tokens.referesh_token)

//         await dispatch(setUser(res.data.user))
//         resetAndNavigate('BottomTab')
//     } catch (error:any) {
//         Alert.alert('Something gone wrong,Try again.')
//         if (axios.isAxiosError(error)) {
//             console.error('Axios error details:', error.message);
//             // console.error('Axios error response:', error.response);
//           } else {
//             console.error('Error in register:', error);
//           }
//     }
// }