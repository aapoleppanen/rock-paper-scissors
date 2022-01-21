import React, { createContext, useContext, useEffect } from "react";

//hooks for livegames

//replace with config

export const WsContext = createContext({ ws: null });

export const WsProvider = ({ children }) => {
	const ws = new WebSocket("wss://bad-api-assignment.reaktor.com/rps/live");

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
	}, []);

	return <WsContext.Provider value={{ ws: ws }}>{children}</WsContext.Provider>;
};

export const useWebSocket = (eventName, handler) => {
	const { ws } = useContext(WsContext);

	//ws object is used in the dep. array to
	//prevent re-render from stateprovider
	useEffect(() => {
		console.log("adding listener");
		ws.addEventListener(eventName, handler);
	}, [ws]);

	return () => {
		console.log("removing listener");
		ws.removeEventListener(eventName, handler);
	};
};
