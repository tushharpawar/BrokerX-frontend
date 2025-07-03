import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { FC, use, useState, useCallback } from 'react'
import CustomView from '../../components/global/CustomView'
import { Colors } from '../../constants/Colors'
import { useAppDispatch, useAppSelector } from '../../redux/reduxHook'
import { refetchUser } from '../../redux/actions/userAction'
import { signOutUser } from '../../redux/SocialLogin'
import { resetAndNavigate } from '../../utils/NavigationUtils'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

type RootStackParamList = {
  AddMoneyScreen: undefined;
};

const SettingScreen: FC = () => {
  const { user } = useAppSelector((state) => state?.user)
  const dispatch = useAppDispatch()
  const navigation = useNavigation<any>()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Refresh user data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Check if user is logged in, if not redirect to login
      if (!user) {
        resetAndNavigate('LoginScreen');
        return;
      }
      dispatch(refetchUser());
    }, [dispatch, user])
  );

  // Early return if no user data (after hooks)
  if (!user) {
    return null; // Or a loading spinner
  }

  const handlePayment = async () => {
    navigation.navigate('AddMoneyScreen')
  }

  const handleOrdersNavigation = () => {
    navigation.navigate('OrdersScreen')
  }

  const handleTransactionsNavigation = () => {
    navigation.navigate('TransactionsScreen')
  }

  const handleWithdrawMoney = () => {
    navigation.navigate('WithdrawMoneyScreen')
  }

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout? This will clear all your data and sign you out of Google.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            setIsLoggingOut(true)
            try {
              await dispatch(signOutUser())
            } catch (error) {
              console.error('Logout error:', error)
              Alert.alert('Error', 'Failed to logout completely, but you have been signed out locally.')
            } finally {
              setIsLoggingOut(false)
            }
          },
        },
      ],
    )
  }

  return (
    <CustomView>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image source={{ uri: user?.userImage || '' }} style={styles.image} />
          <Text style={styles.nameText}>{user?.fullName || 'User'}</Text>
        </View>

        <View style={{ height: 2, backgroundColor: "#1F1F2E", marginVertical: 20 }} />

        <TouchableOpacity style={styles.menuContainer}>
          <Ionicons name="wallet-outline" size={28} color={Colors.grey2} />
          <View style={{ flex: 1, marginLeft: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: Colors.white, fontSize: 16 }}>${user?.balance?.toFixed(2) || '0.00'}</Text>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.cardBackground,
                borderRadius: 20,
                marginRight: 8,
                borderWidth: 1,
                borderColor: Colors.primary,
              }}
              onPress={handlePayment}
            >
              <Text style={{ paddingVertical: 8, paddingHorizontal: 20, color: Colors.white }}>Add money</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <View style={{ height: 1, width: '83%', backgroundColor: "#1F1F2E", marginVertical: 20, alignSelf: 'flex-end' }} />

        <TouchableOpacity style={styles.menuContainer} onPress={handleOrdersNavigation}>
          <Ionicons name="receipt-outline" size={28} color={Colors.grey2} />
          <View style={{ flex: 1, marginLeft: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: Colors.white, fontSize: 16 }}>Order History</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.grey2} />
          </View>
        </TouchableOpacity>

        <View style={{ height: 1, width: '83%', backgroundColor: "#1F1F2E", marginVertical: 20, alignSelf: 'flex-end' }} />

        <TouchableOpacity style={styles.menuContainer} onPress={handleTransactionsNavigation}>
          <Ionicons name="card-outline" size={28} color={Colors.grey2} />
          <View style={{ flex: 1, marginLeft: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: Colors.white, fontSize: 16 }}>Transaction History</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.grey2} />
          </View>
        </TouchableOpacity>

        <View style={{ height: 1, width: '83%', backgroundColor: "#1F1F2E", marginVertical: 20, alignSelf: 'flex-end' }} />

        <TouchableOpacity style={styles.menuContainer} onPress={handleWithdrawMoney}>
          <Ionicons name="wallet" size={28} color={Colors.grey2} />
          <View style={{ flex: 1, marginLeft: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: Colors.white, fontSize: 16 }}>Withdraw Money</Text>
            <Ionicons name="chevron-forward" size={20} color={Colors.grey2} />
          </View>
        </TouchableOpacity>

        <View style={{ height: 1, width: '83%', backgroundColor: "#1F1F2E", marginVertical: 20, alignSelf: 'flex-end' }} />

        <TouchableOpacity 
          style={[styles.menuContainer, isLoggingOut && styles.disabledContainer]} 
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          <Ionicons name="log-out-outline" size={28} color={Colors.danger} />
          <View style={{ flex: 1, marginLeft: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: Colors.danger, fontSize: 16 }}>
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Text>
            {isLoggingOut && (
              <Ionicons name="reload" size={16} color={Colors.danger} style={{ marginLeft: 8 }} />
            )}
          </View>
        </TouchableOpacity>

        <View style={{ height: 2, backgroundColor: "#1F1F2E", marginVertical: 20 }} />
      </ScrollView>
    </CustomView>
  )
}

export default SettingScreen

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingTop: 60,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 100,
    marginBottom: 20,
  },
  nameText: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: 'bold',
  },
  menuContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  disabledContainer: {
    opacity: 0.6,
  },
})