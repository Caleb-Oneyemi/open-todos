import React, { useState, useEffect, useReducer } from "react";
import { Auth } from "aws-amplify";
import { List } from "antd";
import "antd/dist/antd.css";
import { fetchNotes, deleteNote, updateNote } from "../api";

const initialState = {
	notes: [],
	loading: true,
	error: false,
	form: { name: "", description: "" },
};

const reducer = (state, action) => {
	switch (action.type) {
		case "SET_NOTES":
			return { ...state, notes: action.notes, loading: false };
		case "ADD_NOTE":
			return { ...state, notes: [action.note, ...state.notes] };
		case "RESET_FORM":
			return { ...state, form: initialState.form };
		case "SET_INPUT":
			return { ...state, form: { ...state.form, [action.name]: action.value } };
		case "ERROR":
			return { ...state, loading: false, error: true };
		default:
			return state;
	}
};

const styles = {
	container: { padding: 20 },
	input: { marginBottom: 10 },
	item: { textAlign: "left", cursor: "pointer" },
	p: { color: "#1890ff" },
};

export default function App() {
	const renderItem = (item) => {
		return (
			<List.Item
				style={styles.item}
				actions={
					item.clientId === id
						? [
								<p
									style={styles.p}
									onClick={() => deleteNote(item, dispatch, state)}
								>
									Delete
								</p>,
								<p
									style={styles.p}
									onClick={() => updateNote(item, dispatch, state)}
								>
									{item.completed ? "completed" : "mark completed"}
								</p>,
						  ]
						: []
				}
			>
				<List.Item.Meta title={item.name} description={item.description} />
			</List.Item>
		);
	};

	const [state, dispatch] = useReducer(reducer, initialState);
	const [id, setId] = useState("");

	useEffect(() => {
		fetchNotes(dispatch);

		Auth.currentUserPoolUser()
			.then((data) => {
				setId(data.username);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	return (
		<div style={styles.container}>
			<List
				loading={state.loading}
				dataSource={state.notes}
				renderItem={renderItem}
			/>{" "}
		</div>
	);
}
