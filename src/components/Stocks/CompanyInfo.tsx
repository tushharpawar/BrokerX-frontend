// components/CompanyInfo.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const CompanyInfo = ({ name, ceo, industry, about }:any) => (
  <View style={styles.card}>
    <Text style={styles.name}>{name}</Text>
    <Text style={styles.ceo}>CEO: {ceo}</Text>
    <Text style={styles.industry}>Industry: {industry}</Text>
    <Text style={styles.about}>{about}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f4f0fa',
    margin: 10,
  },
  name: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  ceo: { color: '#666' },
  industry: { color: '#666' },
  about: { marginTop: 8, color: '#444' },
});
