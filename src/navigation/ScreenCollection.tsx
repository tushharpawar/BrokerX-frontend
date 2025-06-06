import LoginScreen from "../screens/auth/LoginScreen";
import SplashScreen from "../screens/auth/SplashScreen";
import CatogaryStocksScreen from "../screens/home/CatogaryStocksScreen";
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

export const homeStack = [
    {
        name:'HomeScreen',
        component:HomeScreen
    },{
        name:'CatogaryStocksScreen',
        component:CatogaryStocksScreen,
    }
]

export const mergedStack = [...bottomTabStack,...authStack,...homeStack];