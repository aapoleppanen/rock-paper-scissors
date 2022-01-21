import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { reducer, StateProvider } from "./state";
import { WsProvider } from "./services/liveGames";
import ThemeProvider from "./theme";

//state provider causes re-render
//which causes double event listener

ReactDOM.render(
	<React.StrictMode>
		<WsProvider>
			<StateProvider reducer={reducer}>
				<ThemeProvider>
					<App />
				</ThemeProvider>
			</StateProvider>
		</WsProvider>
	</React.StrictMode>,
	document.getElementById("root")
);
