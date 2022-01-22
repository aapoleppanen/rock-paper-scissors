import React, { createContext, useContext, useEffect, useMemo } from "react";
import { WS_LINK } from "../config/config";

export const WsContext = createContext({ ws: null });

export const WsProvider = ({ children }) => {
	const ws = useMemo(() => new WebSocket(WS_LINK), []);

	useEffect(() => {
		ws.addEventListener("open", () => {
			console.log("Connected to WS");
		});

		ws.addEventListener("error", (e) => {
			console.log(e);
		});

		return () => {
			ws.close();
		};
	}, [ws]);

	return <WsContext.Provider value={{ ws: ws }}>{children}</WsContext.Provider>;
};

export const useWebSocket = (eventName, handler) => {
	const { ws } = useContext(WsContext);

	useEffect(() => {
		console.log("adding listener");
		ws.addEventListener(eventName, handler);
	}, [ws]);

	return () => {
		console.log("removing listener");
		ws.removeEventListener(eventName, handler);
	};
};
