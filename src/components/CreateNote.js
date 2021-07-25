import React, { useState, useEffect, useReducer } from "react";
import { API, Auth } from "aws-amplify";
import { Input, Button } from "antd";
import "antd/dist/antd.css";
import { onCreateNote } from "../graphql/subscriptions";
import { createNote } from "../api";

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

export default function App(props) {
  const [id, setId] = useState('');
  const CLIENT_ID = id;

	const onChange = (e) => {
		dispatch({ type: "SET_INPUT", name: e.target.name, value: e.target.value });
	};

	useEffect(() => {
		Auth.currentAuthenticatedUser().catch(() => {
			props.history.push("/profile");
		});

    Auth.currentUserPoolUser().then((data) => {
      setId(data.username);
    }).catch((err) => {
      console.log(err)
    })
	}, []);

	useEffect(() => {
		const subscription = API.graphql({
			query: onCreateNote,
		}).subscribe({
			next: (noteData) => {
				const note = noteData.value.data.onCreateNote;
				if (CLIENT_ID === note.clientId) return;
				dispatch({ type: "ADD_NOTE", note });
			},
		});

		return () => subscription.unsubscribe();
	}, []);

	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<div style={styles.container}>
			<Input
				onChange={onChange}
				value={state.form.name}
				placeholder="Todo Title"
				name="name"
				style={styles.input}
			/>{" "}
			<Input
				onChange={onChange}
				value={state.form.description}
				placeholder="Todo Description"
				name="description"
				style={styles.input}
			/>{" "}
			<Button
				onClick={() => createNote(dispatch, state, CLIENT_ID)}
				type="primary"
			>
				Create Todo
			</Button>
		</div>
	);
}
