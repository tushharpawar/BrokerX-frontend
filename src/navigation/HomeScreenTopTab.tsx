import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { Colors } from '../constants/Colors';
import HomeScreen from '../screens/home/HomeScreen';
import HoldingsScreen from '../screens/holdings/HoldingsScreen';
import { useAppDispatch } from '../redux/reduxHook';
import { useSelector } from 'react-redux';
import { getHoldingsAction } from '../redux/actions/buyAction';

const TopTab = createMaterialTopTabNavigator();

const HomeScreenTopTab = () => {

    const dispatch = useAppDispatch();
    const {user} = useSelector((state:any) => state.user);

    const getHoldings = async() => {
            await dispatch(getHoldingsAction({userId:user._id}))
    }
    useEffect(() =>{
      getHoldings();
    },[dispatch, user])

  return (
    <TopTab.Navigator
    screenOptions={{
        tabBarActiveTintColor: Colors.white,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: { fontSize: 16, fontWeight: '800' },
        tabBarStyle: { backgroundColor: Colors.tabBackground, borderBottomColor: Colors.tabBorder,padding:3 },
        tabBarIndicatorStyle: { backgroundColor: Colors.white, height: 3, borderRadius: 4 },
    }} 
    >
        <TopTab.Screen name='Stocks' component={HomeScreen}/>
        <TopTab.Screen name='Holdings' component={HoldingsScreen}/>
    </TopTab.Navigator>
  )
}

export default HomeScreenTopTab