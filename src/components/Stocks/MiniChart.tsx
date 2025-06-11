import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Colors } from '../../constants/Colors';
import { getTimeRange } from '../../utils/functions/getTimeRange';
import {
    LineChart
} from 'react-native-wagmi-charts';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import dayjs from "dayjs"

interface MiniChartProps {
    symbol: string;
    color?: string;
}

const filters: Array<"1D" | "1W" | "1M" | "1Y" | "5Y"> = ["1D", "1W", "1M", "1Y", "5Y"];
const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth * 0.9;
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

const MiniChart = ({ symbol,color }: MiniChartProps) => {

    const [historicalPrices, setHistoricalPrices] = useState<any>([]);
    const [dataFetched, setDataFetched] = useState(false);
    const [data, setData] = useState<any>([]);
    const [selectedFilter, setSelectedFilter] = useState<"1D" | "1W" | "1M" | "1Y" | "5Y">("1D");

    useEffect(() => {
        const data = historicalPrices?.map((d:any) => ({
            value: d.price,
            timestamp: d.time,
        }));
        setData(data);
        console.log("Processed Data:", data);
    }, [dataFetched]);

    const fetchHistoricalData = async (symbol: string, filter: "1D" | "1W" | "1M" | "1Y" | "5Y") => {
        setDataFetched(false);
        setSelectedFilter(filter);
        setData([]);
        setHistoricalPrices([]);

        const { from, to, resolution } = await getTimeRange(symbol, filter);
        const newFrom = dayjs.unix(from).format("YYYY-MM-DD HH:mm:ss")
        const newTo = dayjs.unix(to).format("YYYY-MM-DD HH:mm:ss")

        console.log("FROM:", from, "TO:", to, "RESOLUTION:", resolution);
        console.log("New From:", newFrom, "New To:", newTo);

        try {
            const response = await axios.get("https://api.twelvedata.com/time_series", {
                params: {
                    symbol: symbol,
                    start_date: newFrom,
                    end_date: newTo,
                    interval: resolution,
                    outputsize: 1000,
                    apikey: 'ed0ff8bd51a44ef7b5a59c5014a890b1',
                },
            });

            if (response) {
                const data = response?.data?.values?.map((item: any) => ({
                    time: new Date(item.datetime).getTime(),
                    price: parseFloat(item.close),
                })).reverse();
                setHistoricalPrices(data);
                setDataFetched(true);
                console.log("Historical Data:", data);
                return data;
            }
        } catch (error) {
            console.error("Error fetching historical data:", error);
            setDataFetched(false);
            return [];
        }
    }

    useEffect(() => {
        if (symbol) {
            fetchHistoricalData(symbol, selectedFilter)
        } else {
            console.warn("No symbol provided for historical prices");
        }
    }, [symbol]);

    return (
        <>
            {
            historicalPrices?.length > 0 && data.length > 0 && (
                    <View style={{width: '100%'}}>
                        <View style={{ width: '100%', justifyContent:'center',alignItems: 'center', paddingVertical: 10 }}>
                            <LineChart.Provider data={data}>
                                <LineChart height={250} width={chartWidth}>
                                    <LineChart.Path color={color||'limegreen'} width={1.25}>
                                        <LineChart.HorizontalLine at={{ index: 0 }} />
                                    </LineChart.Path>
                                    <LineChart.CursorLine color={Colors.white}  onActivated={() => ReactNativeHapticFeedback.trigger("impactHeavy", options)}/>
                                </LineChart>
                                <LineChart.PriceText style={{ fontSize: 16, color: color||'limegreen' }} />
                                <LineChart.DatetimeText
                                    style={{ fontSize: 12, color: 'gray' }}
                                />
                            </LineChart.Provider>
                        </View>

                        <View style={styles.filterButtonContainer} >
                            {filters.map(filter => (
                                <TouchableOpacity style={selectedFilter == filter ? styles.selectedFilterButton : styles.filterButton} key={filter} onPress={() => fetchHistoricalData(symbol, filter)}>
                                    <Text style={selectedFilter == filter ? styles.selectedFilterText : styles.filterText}>{filter}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )
            }
        </>
    )
}

export default MiniChart

const styles = StyleSheet.create({
    filterButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        margin: 4,
        borderRadius: 18,
        backgroundColor: Colors.cardBackground,
        borderColor: Colors.tabBorder,
        borderWidth: 2,
    },
    selectedFilterButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        margin: 4,
        borderRadius: 18,
        backgroundColor: Colors.cardBackground,
        borderColor: Colors.primaryGradientEnd,
        borderWidth: 2,
    },
    filterText: {
        color: Colors.white,
    },
    selectedFilterText: {
        color: Colors.white,
    },
})