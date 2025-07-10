import {useEffect, useState} from 'react';
import {API_BASE_URL} from '../../redux/API';
import {io} from 'socket.io-client';

const socket = io(API_BASE_URL);

const useStockLivePrice = (symbol: string) => {

  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    socket.emit("subscribe-to-single", symbol);

    socket.on("stock-single-update", (data) => {
      if (data.symbol === symbol) {
        setPrice(data.price); // set state here
      }
    });

    return () => {
      socket.emit("unsubscribe-from-single");
      socket.off("stock-single-update");
    };
  }, [symbol]);

  return {price};
};

export default useStockLivePrice;
