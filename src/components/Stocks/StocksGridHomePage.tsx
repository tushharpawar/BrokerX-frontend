import { TouchableOpacity, View, StyleSheet, Dimensions } from "react-native";
import StocksHomeCard from "./StocksHomeCard";
import { Text } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../../constants/Colors";
import Ionicons from 'react-native-vector-icons/Ionicons';


type  CatogaryStocksScreen = { stocks: any; title: string,category: string };

const CARD_WIDTH = (Dimensions.get("window").width - 30) / 2;


const StockGrid = ({ stocks, title, category }:CatogaryStocksScreen) => {
    const firstTwo = stocks.slice(0, 2);
    const third = stocks[2];
    const navigation = useNavigation<any>(); 

    const onSeeMore = () => {
        navigation.navigate("CatogaryStocksScreen", {
            stocks: stocks,
            title: title || "Stocks",
            category: category || "",
        });
    }

    return (
        <View >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                {firstTwo.map((stock: any) => (
                    <StocksHomeCard item={stock} key={stock.symbol} />
                ))}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {third && <StocksHomeCard item={third} />}
                <TouchableOpacity
                    onPress={() => onSeeMore()}
                    style={styles.seeMoreButton}
                >
                    <View style={styles.seeMoreContent}>
                        <Ionicons 
                            name="grid-outline" 
                            size={28} 
                            color={Colors.primary} 
                            style={styles.seeMoreIcon}
                        />
                        <Text style={styles.seeMoreText}>See More</Text>
                        <Ionicons 
                            name="chevron-forward" 
                            size={18} 
                            color={Colors.primary} 
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    seeMoreButton: {
        width: CARD_WIDTH,
        backgroundColor: Colors.cardBackground,
        borderRadius: 12,
        padding: 10,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
        borderWidth: 1,
        borderColor: Colors.primary + '20', 
    },
    seeMoreContent: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    seeMoreIcon: {
        marginBottom: 8,
    },
    seeMoreText: {
        color: Colors.primary,
        fontWeight: '600',
        fontSize: 14,
        marginBottom: 4,
    },
});

export default StockGrid;