// components/HoldingCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { Image } from 'react-native';

const HoldingCard = ({ symbol, quantity, avgPrice,currentPrice,logo,prevClose,companyName,price,change,changePercent}:any) => {

  const navigation = useNavigation()  
  const investedValue = avgPrice * quantity;
  const safeCurrentPrice = currentPrice! ;
  const currentValue = safeCurrentPrice * quantity;
  const pnl = currentValue - investedValue;
  const pnlPercent = ((pnl / investedValue) * 100).toFixed(2);
  const isProfit = pnl >= 0;

  let stock = {
    symbol,
    price,
    change,
    companyName,
    logo,
    prevClose,
    changePercent
  }

  const navigaeToProductDetails = () => {
    navigation.navigate('StocksDetails',{stock});
  }

  return (
    <TouchableOpacity style={styles.card} onPress={navigaeToProductDetails}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {logo && <Image source={{ uri: logo }} style={{ width: 24, height: 24, marginRight: 8 }} />}
          <Text style={styles.symbol}>{companyName || symbol}</Text>
        </View>
        {/* <Text style={styles.symbol}>{symbol}</Text> */}
        <Text style={[styles.pnl, { color: isProfit ? 'limegreen' : '#ff4d4f' }]}>
          {isProfit ? '+' : ''}
          {pnl.toFixed(2)} ({pnlPercent}%)
        </Text>
      </View>

      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Qty</Text>
          <Text style={styles.value}>{quantity}</Text>
        </View>
        <View>
          <Text style={styles.label}>Avg Price</Text>
          <Text style={styles.value}>${avgPrice.toFixed(2)}</Text>
        </View>
        <View>
            <Text style={styles.label}>Price</Text>
          <Text style={styles.value}>${(currentPrice ?? 0).toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Invested: ${investedValue.toFixed(2)}</Text>
        <Text style={styles.footerText}>Current: ${currentValue.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default HoldingCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderColor: '#2c2c2e',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  symbol: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  pnl: {
    fontSize: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  label: {
    fontSize: 12,
    color: '#8e8e93',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#2c2c2e',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#8e8e93',
  },
});
