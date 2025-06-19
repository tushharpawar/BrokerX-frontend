// components/RangeBar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

interface RangeBarProps {
  low: number;
  high: number;
  current: number;
}

const RangeBar: React.FC<RangeBarProps> = ({ low=0, high=100, current=50 }) => {
  const percentage = ((current - low) / (high - low)) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <View style={[styles.fill, { left: `${percentage}%` }]} />
      </View>
      <View style={styles.range}>
        <Text style={{color:Colors.white}}>{low}</Text>
        <Text style={{color:Colors.white}}>{high}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { margin: 8 },
  label: { marginBottom: 4, color: '#888' },
  bar: {
    height: 3,
    backgroundColor: Colors.grey4,
    borderRadius: 3,
    position: 'relative',
  },
  fill: {
    position: 'absolute',
    top: -6,
    width: 10,
    height: 14,
    backgroundColor: Colors.primary, // lavender
    borderRadius: 5,
  },
  range: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    color:Colors.white
  },
});

export default RangeBar;
