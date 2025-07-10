import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { FC, useEffect } from 'react';
import HomeContainer from '../screens/home/HomeContainer';
import SearchScreen from '../screens/search/SearchScreen';
import NewsScreen from '../screens/news/NewsScreen';
import SettingScreen from '../screens/settings/SettingScreen';
import { Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors} from '../constants/Colors';
import { fetchStocks } from '../redux/actions/stockAction';
import { useAppDispatch } from '../redux/reduxHook';
import useLiveStocks from '../hooks/useLiveStocks';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PlatformConstants } from '../utils/PlatformUtils';

const Tab = createBottomTabNavigator();

const BottomTab:FC =()=>{
    const dispatch = useAppDispatch()
    const insets = useSafeAreaInsets();
    
    useEffect(()=>{
        dispatch(fetchStocks())
    },[dispatch])

    useLiveStocks()

    // Simpler tab bar height calculation
    const tabBarHeight = Platform.OS === 'android' ? 85 : 85;

    return(
        <Tab.Navigator
        screenOptions={() => ({
            headerShown: false,
            tabBarHideOnKeyboard:true,
            tabBarStyle:{
                paddingTop: 8,
                paddingBottom: Platform.OS === 'ios' ? insets.bottom + 5 : 8,
                backgroundColor: Colors.tabBackground,
                borderColor: Colors.tabBorder,
                borderTopWidth: 1,
                height: tabBarHeight,
            },    
            tabBarActiveTintColor: Colors.tabActive,
            tabBarInactiveTintColor: Colors.tabInactive,
            tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '500',
                marginTop: -2,
            },
        }
        )}
        >
            <Tab.Screen
            name='Home'
            component={HomeContainer}
            options={{
                tabBarIcon: ({focused}) => (
                    focused ? <Ionicons name='home' size={RFValue(20)} color={Colors.tabActive} /> : <Ionicons name='home-outline' size={RFValue(20)} color={Colors.tabInactive} />
                ) ,
            }}
            />
            <Tab.Screen
            name='Search'
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