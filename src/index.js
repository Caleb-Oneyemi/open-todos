import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Router from './components/Router';
import Amplify from "aws-amplify";
import config from "./aws-exports";

Amplify.configure(config);

ReactDOM.render(
	<React.StrictMode>
		<Router />
	</React.StrictMode>,
	document.getElementById("root")
);
