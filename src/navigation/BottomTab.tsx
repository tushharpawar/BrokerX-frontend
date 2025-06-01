import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { FC, useEffect } from 'react';
import HomeScreen from '../screens/home/HomeScreen';
import SearchScreen from '../screens/search/SearchScreen';
import NewsScreen from '../screens/news/NewsScreen';
import SettingScreen from '../screens/settings/SettingScreen';
import { Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors} from '../constants/Colors';
import { fetchStocks } from '../redux/actions/stockAction';
import { useAppDispatch } from '../redux/reduxHook';
import { io } from 'socket.io-client';


const Tab = createBottomTabNavigator();

const BottomTab:FC =()=>{
    const dispatch = useAppDispatch()
    useEffect(()=>{
        dispatch(fetchStocks())
    },[dispatch])

useEffect(() => {
  const socket = io("http://192.168.1.2:3000");

  socket.on("stock-update", (data) => {
    console.log("DATA SOCKEt",data);
    // setState to re-render
  });

  return () => {
    socket.disconnect();
  };
}, []);

    return(
        <Tab.Navigator
        screenOptions={() => ({
            headerShown: false,
            tabBarHideOnKeyboard:true,
            tabBarStyle:{
                paddingTop:Platform.OS === 'ios' ? RFValue(10) : RFValue(5),
                paddingBottom:Platform.OS === 'ios' ? 20 : 10,
                backgroundColor:Colors.tabBackground,
                borderColor:Colors.tabBorder,
                position:'absolute',
                height:Platform.OS==='android'? 70 : 90,
                borderTopWidth:0,
            },    
            tabBarActiveTintColor: Colors.tabActive,
            tabBarInactiveTintColor: Colors.tabInactive,  
        }
        )}
        >
            <Tab.Screen
            name='Home'
            component={HomeScreen}
            options={{
                tabBarIcon: ({focused}) => (
                    focused ? <Ionicons name='home' size={RFValue(20)} color={Colors.tabActive} /> : <Ionicons name='home-outline' size={RFValue(20)} color={Colors.tabInactive} />
                ) ,
            }}
            />
            <Tab.Screen
            name='Seach'
            component={SearchScreen}
            options={{
                tabBarIcon: ({focused}) => (
                    focused ? <Ionicons name='search' size={RFValue(20)} color={Colors.tabActive} /> : <Ionicons name='search-outline' size={RFValue(20)} color={Colors.tabInactive} />
                )   
            }}
            />
            <Tab.Screen
            name='News'
            component={NewsScreen}
            options={{
                tabBarIcon: ({focused}) => (
                    focused ? <Ionicons name='newspaper' size={RFValue(20)} color={Colors.tabActive} /> : <Ionicons name='newspaper-outline' size={RFValue(20)} color={Colors.tabInactive} />
                )   
            }}
            />
            <Tab.Screen
            name='Settings'
            component={SettingScreen}
            options={{
                tabBarIcon: ({focused}) => (
                    focused ? <Ionicons name='settings' size={RFValue(20)} color={Colors.tabActive} /> : <Ionicons name='settings-outline' size={RFValue(20)} color={Colors.tabInactive} />
                )   
            }}
            />
        </Tab.Navigator>
    )
}

export default BottomTab;