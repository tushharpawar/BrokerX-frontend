import { Component } from "react";
import LoginScreen from "../screens/auth/LoginScreen";
import SplashScreen from "../screens/auth/SplashScreen";
import CatogaryStocksScreen from "../screens/home/CatogaryStocksScreen";
import HomeScreen from "../screens/home/HomeScreen";
import StocksDetails from "../screens/stocks/StocksDetails";
import BottomTab from "./BottomTab";
import AddMoneyScreen from "../screens/settings/AddMoneyScreen";
import SettingScreen from "../screens/settings/SettingScreen";

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

export const stockStack = [
    {
        name:'StocksDetails',
        component:StocksDetails,
    }
]

export const settingsStack = [
    {
        name:'SettingScreen',
        component:SettingScreen
    },
    {
        name:'AddMoneyScreen',
        component:AddMoneyScreen
    }
]

export const mergedStack = [...bottomTabStack,...authStack,...homeStack,...stockStack,...settingsStack];