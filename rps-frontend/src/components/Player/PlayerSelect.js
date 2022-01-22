import React, { useEffect, useState } from "react";
import playerService from "../../services/players";
import Select from "react-select";
import PlayerHistory from "./PlayerHistory";
import { Container } from "theme-ui";

const PlayerHistoryView = () => {
	const [players, setPlayers] = useState([]);
	const [select, setSelected] = useState("");

	useEffect(() => {
		const initializeData = async () => {
			try {
				const data = await playerService.getPlayers();
				setPlayers(data);
			} catch (e) {
				console.log(e);
			}
		};
		initializeData();
	}, []);

	const handleChange = (selected) => {
		try {
			const p = players.filter((p) => p.name === selected.label);
			setSelected(p[0]._id);
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<Container>
			<Container p={1}>
				<Select
					options={players.reduce(
						(a, p) => [
							...a,
							{
								value: p.name.toLowerCase(),
								label: p.name,
							},
						],
						[]
					)}
					onChange={handleChange}
					placeholder={"Search for players..."}
					styles={{
						borderRadius: "12px",
						control: (base) => ({
							...base,
							fontFamily: "Roboto, Sans-serif",
							fontWeight: "300",
						}),
						menu: (base) => ({
							...base,
							fontFamily: "Roboto, Sans-serif",
							fontWeight: "300",
						}),
					}}
					controlShouldRenderValue={false}
				></Select>
			</Container>
			<PlayerHistory id={select}></PlayerHistory>
		</Container>
	);
};

export default PlayerHistoryView;
