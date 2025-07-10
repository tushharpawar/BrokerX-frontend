import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { API_BASE_URL } from '../../redux/API';
import { io } from 'socket.io-client';
import { updateHoldingPrice } from '../../redux/reducers/holdingSlice';

const socket = io(API_BASE_URL);

const useStockLiveAlpacaPrice = (symbol: string) => {
  const [data, setData] = useState<any>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.emit("subscribe-to-alpaca", symbol);

    socket.on("alpaca-price-update", (data) => {
      setData(data); // set state here

      // Update holding price in Redux
      if (data?.symbol && data?.price !== undefined) {
        dispatch(updateHoldingPrice({ symbol: data.symbol, price: data.price }));
      }
    });

    return () => {
      socket.off("alpaca-price-update");
    };
  }, [symbol, dispatch]);

  return { data };
};

export default useStockLiveAlpacaPrice;