import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
// import { initStocks, patchStock } from "../redux/reducers/stockSlice";
import { useEffect } from "react";
import { BASE_URL, GET_STOCKS } from "../redux/API";

export default function useLiveStocks() {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io(GET_STOCKS);

    // socket.on("init",   (data) => dispatch(initStocks(data)));
    // socket.on("stock-update", (card) => dispatch(patchStock(card)));

    return () => { socket.disconnect(); };
  }, []);
}
