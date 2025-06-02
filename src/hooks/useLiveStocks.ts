import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { patchStock } from "../redux/reducers/stockSlice";

export default function useLiveStocks() {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io('http://192.168.1.2:3000');

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('stock-update', (data) => {
      dispatch(patchStock(data));
    })

    return () => { socket.disconnect(); };
  }, []);
}
