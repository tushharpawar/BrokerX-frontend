import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { FC, use, useState } from 'react'
import CustomView from '../../components/global/CustomView'
import { Colors } from '../../constants/Colors'
import { useAppDispatch, useAppSelector } from '../../redux/reduxHook'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

type RootStackParamList = {
  AddMoneyScreen: undefined;
  // ... add other screens here if needed
};

const SettingScreen: FC = () => {
  const { user } = useAppSelector((state) => state?.user)
  const dispatch = useAppDispatch()
  const navigation = useNavigation<any>()

  console.log("User", user)

  //  const [amount,setAmount] = useState<string>(100)

  const handlePayment = async () => {
    navigation.navigate('AddMoneyScreen')
  }

  return (
    <CustomView>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image source={{ uri: user?.userImage }} style={styles.image} />
          <Text style={styles.nameText}> {user?.fullName} </Text>
        </View>

      //Horizontal line
        <View style={{ height: 2, backgroundColor: "#1F1F2E", marginVertical: 20 }} />

        <TouchableOpacity style={styles.menuContainer}>
          <Ionicons name="wallet-outline" size={28} color={Colors.grey2} />
          <View style={{ flex: 1, marginLeft: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: Colors.white, fontSize: 16 }}>$ {user?.balance}</Text>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.cardBackground
                , borderRadius: 20,
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

        <TouchableOpacity style={styles.menuContainer}>
          <Ionicons name="receipt-outline" size={28} color={Colors.grey2} />
          <View style={{ flex: 1, marginLeft: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: Colors.white, fontSize: 16 }}>Orders</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 1, width: '83%', backgroundColor: "#1F1F2E", marginVertical: 20, alignSelf: 'flex-end' }} />

        <TouchableOpacity style={styles.menuContainer}>
          <Ionicons name="person-outline" size={28} color={Colors.grey2} />
          <View style={{ flex: 1, marginLeft: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: Colors.white, fontSize: 16 }}>Your Account</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 1, width: '83%', backgroundColor: "#1F1F2E", marginVertical: 20, alignSelf: 'flex-end' }} />

        <TouchableOpacity style={styles.menuContainer}>
          <Ionicons name="shield-half-outline" size={28} color={Colors.grey2} />
          <View style={{ flex: 1, marginLeft: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: Colors.white, fontSize: 16 }}>Security</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 1, width: '83%', backgroundColor: "#1F1F2E", marginVertical: 20, alignSelf: 'flex-end' }} />

        <TouchableOpacity style={styles.menuContainer}>
          <Ionicons name="log-out-outline" size={28} color={Colors.grey2} />
          <View style={{ flex: 1, marginLeft: 30, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: Colors.white, fontSize: 16 }}>Logout</Text>
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
})