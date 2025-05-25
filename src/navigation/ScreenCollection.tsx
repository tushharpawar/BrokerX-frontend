import LoginScreen from "../screens/auth/LoginScreen";
import SplashScreen from "../screens/auth/SplashScreen";
import HomeScreen from "../screens/home/HomeScreen";
import BottomTab from "./BottomTab";

export const authStack = [
    {
        name:'LoginScreen',
        component:LoginScreen
    },
    {
        name:'SplashScreen',
        component:SplashScreen
    }
]

export const bottomTabStack = [
    {
        name:'BottomTab',
        component:BottomTab
    }
]

export const mergedStack = [...bottomTabStack,...authStack]