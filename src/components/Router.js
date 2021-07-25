import React, { useState, useEffect } from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import Nav from "./Nav";
import CreateNote from "./CreateNote";
import Notes from "./Notes";
import Profile from "./Profile";

const Router = () => {
	const [current, setCurrent] = useState("home");

	const setRoute = () => {
		const location = window.location.href.split("/");
		const pathname = location[location.length - 1];
		setCurrent(pathname ? pathname : "home");
	};

	useEffect(() => {
		setRoute();
		window.addEventListener("hashchange", setRoute);
		return () => window.removeEventListener("hashchange", setRoute);
	}, []);

	return (
		<HashRouter>
			<Nav current={current} />
			<Switch>
				<Route exact path="/" component={Notes} />
				<Route exact path="/create" component={CreateNote} />
				<Route exact path="/profile" component={Profile} />
				<Route component={Notes} />
			</Switch>
		</HashRouter>
	);
};

export default Router;
