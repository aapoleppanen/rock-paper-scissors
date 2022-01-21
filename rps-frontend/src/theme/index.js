import React from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/500.css";
import { ThemeProvider } from "theme-ui";

const theme = {
	breakpoints: ["850px", "1260px", "64em"],
	fontSizes: [12, 14, 16, 20, 24, 32, 48, 64],
	colors: {
		blue: "#07c",
		lightgray: "#f6f6ff",
		primary: "grey",
		secondary: "white",
		lose: "EF6F6C",
		win: "7FB685",
		tie: "DDAE7E",
	},
	space: [0, 4, 8, 16, 32, 64, 128, 256],
	fonts: {
		// body: "system-ui, sans-serif",
		// heading: "inherit",
		// monospace: "Menlo, monospace",
		body: "Roboto, sans-serif",
		heading: "Roboto, sans-serif",
		monospace: "Menlo, monospace",
	},
	fontWeights: {
		body: 300,
		heading: 500,
		bold: 500,
	},
	lineHeights: {
		body: 1.5,
		heading: 1.25,
	},
	shadows: {
		small: "0 0 4px rgba(0, 0, 0, .125)",
		large: "0 0 24px rgba(0, 0, 0, .125)",
	},
	variants: {
		primaryBox: {
			border: "primary",
			borderRadius: "primary",
			margin: "0 5px 0 5px",
			width: "400px",
			height: "700px",
		},
		centered: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		},
	},
	text: {
		default: {
			fontFamily: "Roboto, sans-serif",
			fontWeight: "300",
		},
	},
	buttons: {
		primary: {
			color: "white",
			bg: "primary",
			fontFamily: "Roboto, sans-serif",
			fontWeight: "300",
		},
	},
	layout: {
		centered: {
			display: "flex",
			justifyContent: "center",
			alignItems: "center",
		},
	},
	borders: {
		primary: "2px solid black",
	},
	radii: {
		primary: "12px",
	},
};

export default ({ children }) => (
	<ThemeProvider theme={theme}>{children}</ThemeProvider>
);
