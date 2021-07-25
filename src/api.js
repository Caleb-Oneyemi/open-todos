import { API } from "aws-amplify";
import { v4 as uuid } from "uuid";
import { listNotes } from "./graphql/queries";
import {
	createNote as CreateNote,
	updateNote as UpdateNote,
	deleteNote as DeleteNote,
} from "./graphql/mutations";

export const fetchNotes = async (dispatch) => {
	try {
		const notesData = await API.graphql({
			query: listNotes,
		});

		dispatch({ type: "SET_NOTES", notes: notesData.data.listNotes.items });
	} catch (err) {
		console.log("error: ", err);
		dispatch({ type: "ERROR" });
	}
};

export const createNote = async (dispatch, state, CLIENT_ID) => {
	const { form } = state;
	if (!form.name || !form.description) {
		return alert("please enter a name and description");
	}

	const note = { ...form, clientId: CLIENT_ID, completed: false, id: uuid() };
	dispatch({ type: "ADD_NOTE", note });
	dispatch({ type: "RESET_FORM" });

	try {
		await API.graphql({
			query: CreateNote,
			variables: { input: note },
		});
		console.log("successfully created note!");
	} catch (err) {
		console.log("error: ", err);
	}
};

export const updateNote = async (note, dispatch, state) => {
	const index = state.notes.findIndex((n) => n.id === note.id);
	const notes = [...state.notes];
	notes[index].completed = !note.completed;
	dispatch({ type: "SET_NOTES", notes });
	try {
		await API.graphql({
			query: UpdateNote,
			variables: {
				input: { id: note.id, completed: notes[index].completed },
			},
		});
		console.log("note successfully updated!");
	} catch (err) {
		console.log("error: ", err);
	}
};

export const deleteNote = async ({ id }, dispatch, state) => {
	const index = state.notes.findIndex((n) => n.id === id);
	const notes = [
		...state.notes.slice(0, index),
		...state.notes.slice(index + 1),
	];
	dispatch({ type: "SET_NOTES", notes });
	try {
		await API.graphql({
			query: DeleteNote,
			variables: { input: { id } },
		});
		console.log("successfully deleted note!");
	} catch (err) {
		console.log({ err });
	}
};
