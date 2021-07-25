import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import Container from "./Container";

function Profile() {
	const [user, setUser] = useState({});

	const checkUser = async () => {
		try {
			const data = await Auth.currentUserPoolUser();
			const userInfo = { username: data.username, ...data.attributes };
			setUser(userInfo);
		} catch (err) {
			console.log("error: ", err);
		}
	}

  useEffect(() => {
		checkUser();
	}, []);

	return (
		<Container>
			<h1>Profile</h1>
			<h2>Username: {user.username}</h2>
			<h2>Email: {user.email}</h2>
			<h2>Phone: {user.phone_number}</h2>
			<AmplifySignOut />
		</Container>
	);
}
export default withAuthenticator(Profile);
