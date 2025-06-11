import {useEffect, useState} from 'react';
import {BASE_URL} from '../../redux/API';
import {io} from 'socket.io-client';

const socket = io(BASE_URL);

const useStockLivePrice = (symbol: string) => {

  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    console.log("📲 Entering details screen for", symbol);

    socket.emit("subscribe-to-single", symbol);

    socket.on("stock-single-update", (data) => {
      if (data.symbol === symbol) {
        setPrice(data.price); // set state here
      }
    });

    return () => {
      console.log("👋 Leaving detail screen for", symbol);
      socket.emit("unsubscribe-from-single");
      socket.off("stock-single-update");
    };
  }, [symbol]);

  return {price};
};

export default useStockLivePrice;
