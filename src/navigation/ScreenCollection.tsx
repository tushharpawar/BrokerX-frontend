import { Component } from "react";
import LoginScreen from "../screens/auth/LoginScreen";
import SplashScreen from "../screens/auth/SplashScreen";
import CatogaryStocksScreen from "../screens/home/CatogaryStocksScreen";
import HomeScreen from "../screens/home/HomeScreen";
import StocksDetails from "../screens/stocks/StocksDetails";
import BottomTab from "./BottomTab";
import AddMoneyScreen from "../screens/settings/AddMoneyScreen";
import WithdrawMoneyScreen from "../screens/settings/WithdrawMoneyScreen";
import SettingScreen from "../screens/settings/SettingScreen";
import BuyScreen from "../screens/buy/BuyScreen";
import SellScreen from "../screens/buy/SellScreen";
import OrdersScreen from "../screens/orders/OrdersScreen";
import TransactionsScreen from "../screens/transactions/TransactionsScreen";
import { compose } from "redux";
import HoldingsScreen from "../screens/holdings/HoldingsScreen";
import WatchlistScreen from "../screens/watchlist/WatchlistScreen";
import NewsDetailsScreen from "../screens/news/NewsDetailsScreen";
import HomeScreenTopTab from "./HomeScreenTopTab";

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
    // {
    //     name:'HomeScreenTopTab',
    //     component:HomeScreenTopTab
    // },
    {
        name:'HomeScreen',
        component:HomeScreen
    },
    {
        name:'CatogaryStocksScreen',
        component:CatogaryStocksScreen,
    },
    {
        name:'HoldingsScreen',
        component:HoldingsScreen,
    },
    {
        name:'WatchlistScreen',
        component:WatchlistScreen
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
    },
    {
        name:'WithdrawMoneyScreen',
        component:WithdrawMoneyScreen
    },
    {
        name:'OrdersScreen',
        component:OrdersScreen
    },
    {
        name:'TransactionsScreen',
        component:TransactionsScreen
    }
]

export const buyStack = [
    {
        name:'BuyScreen',
        component:BuyScreen
    },
    {
        name:'SellScreen',
        component:SellScreen
    }
]

export const newsStack = [
    {
        name:'NewsDetailsScreen',
        component:NewsDetailsScreen
    }
]

export const mergedStack = [...bottomTabStack,...authStack,...homeStack,...stockStack,...settingsStack,...buyStack,...newsStack];