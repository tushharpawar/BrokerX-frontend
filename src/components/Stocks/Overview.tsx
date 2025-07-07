import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Colors } from '../../constants/Colors';

const screenWidth = Dimensions.get('window').width;
const filters: Array<"Revenue" | "Profit" | "Net Income"> = ["Revenue", "Profit", "Net Income"];

const Overview = ({ stockData, financials }: any) => {

    const [financialData, setFinancialData] = useState<any>({
        labels: [],
        datasets: [{
            data: []
        }]
    });
    const [selectedFilter, setSelectedFilter] = useState<"Revenue" | "Profit" | "Net Income">("Revenue");

    useEffect(() => {
        if (financials && financials.length > 0) {
            setRevenueData();
        }
    }, [financials])

    const setRevenueData = () => {
        setFinancialData({
            labels: financials?.map((item: any) => item.calendarYear) || [],
            datasets: [{
                data: financials?.map((item: any) => (item.revenue / 1e9).toFixed(2)) || []
            }]
        })
    }

    const setNetIncomeData = () => {
        setFinancialData(
            {
                labels: financials?.map((item: any) => item.calendarYear) || [],
                datasets: [{
                    data: financials?.map((item: any) => (item.netIncome / 1e9).toFixed(2)) || []
                }]
            }
        )
    }
    const setGrossProfitData = () => {
        setFinancialData(
            {
                labels: financials?.map((item: any) => item.calendarYear) || [],
                datasets: [{
                    data: financials?.map((item: any) => (item.grossProfit / 1e9).toFixed(2)) || []
                }]
            }
        )
    }

    const setBarData = (filter: "Revenue" | "Profit" | "Net Income") => {
        setSelectedFilter(filter);
        switch (filter) {
            case "Revenue":
                setRevenueData();
                break;
            case "Profit":
                setGrossProfitData();
                break;
            case "Net Income":
                setNetIncomeData();
                break;
            default:
                setRevenueData();
        }
    }

    const chartConfig = {
        backgroundGradientFrom: Colors.background,
        backgroundGradientTo: Colors.background,
        color: (opacity = 1) => `rgba(156, 136, 255, ${opacity})`,
        labelColor: () => Colors.white,
        barPercentage: 1,
        style: { borderRadius: 8 },
        backgroundGradientFromOpacity: 1,
        fillShadowGradientFromOpacity: 1,
        fillShadowGradient: Colors.primary,
        fillShadowGradientToOpacity: 1
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.sectionTitle}>Financials</Text>
            <View style={styles.filterButtonContainer} >
                {filters.map(filter => (
                    <TouchableOpacity style={selectedFilter == filter ? styles.selectedFilterButton : styles.filterButton} key={filter} onPress={() => setBarData(filter)}>
                        <Text style={selectedFilter == filter ? styles.selectedFilterText : styles.filterText}>{filter}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <BarChart
                data={financialData}
                width={screenWidth - 32}
                height={300}
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                showValuesOnTopOfBars={true}
                showBarTops={true}
                fromZero={true}
                yAxisSuffix='B'
                yAxisLabel='$'
                style={{ backgroundColor: Colors.background, marginVertical: 12 }}
                withInnerLines={false}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.background,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 8,
        color: Colors.white
    },
    detailBox: {
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    detail: {
        fontSize: 16,
        marginBottom: 6,
        color: '#333',
    },
    filterButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 12,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        margin: 4,
        borderRadius: 18,
        borderColor: Colors.tabBorder,
        borderWidth: 1,
    },
    selectedFilterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        margin: 4,
        borderRadius: 18,
        backgroundColor: Colors.cardBackground,
        borderColor: Colors.white,
        borderWidth: 1,
    },
    filterText: {
        fontSize: 12,
        color: Colors.white,
    },
    selectedFilterText: {
        fontSize: 12,
        color: Colors.white,
    },
});
export default Overview
