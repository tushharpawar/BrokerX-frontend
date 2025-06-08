import { TouchableOpacity, View } from "react-native";
import StocksHomeCard from "./StocksHomeCard";
import { Text } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";


type  CatogaryStocksScreen = { stocks: any; title: string,category: string };


const StockGrid = ({ stocks, title, category }:CatogaryStocksScreen) => {
    const firstTwo = stocks.slice(0, 2);
    const third = stocks[2];
    const navigation = useNavigation<any>(); 

    const onSeeMore = () => {
        navigation.navigate("CatogaryStocksScreen", {
            stocks: stocks,
            title: title || "Stocks",
            headerShown: true,
            category: category || "",
        });
    }

    return (
        <View >
            {/* First Row (2 cards) */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                {firstTwo.map((stock: any) => (
                    <StocksHomeCard item={stock} key={stock.symbol} />
                ))}
            </View>

            {/* Second Row (1 card + see more) */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {third && <StocksHomeCard item={third} />}
                <TouchableOpacity
                    onPress={() => onSeeMore()}
                    style={{
                        width: '48%',
                        // backgroundColor: '#292929',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 10,
                        padding: 8,
                    }}
                >
                    <Text style={{ color: 'skyblue', fontWeight: 'bold' }}>See More {">"} </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default StockGrid;