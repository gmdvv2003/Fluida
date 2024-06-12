import React, { useEffect, useState } from "react";

import { ReactComponent as ChatBaloonIcon } from "assets/action-icons/chat-balloon.svg";
import { ReactComponent as ClockIcon } from "assets/action-icons/clock.svg";

import Label from "./components/label/Label";
import Notification from "./components/notification/Notification";
import Assignment from "./components/assignment/Assignment";

import "./Card.css";

const Card = React.forwardRef(({ scrollableDivRef, isLoading, card, projectState, projectSocketRef, callbacks }, ref) => {
	const [labels, setLabels] = useState([]);
	const [notifications, setNotifications] = useState([]);
	const [assignments, setAssignments] = useState([]);

	useEffect(() => {}, []);

	return (
		<div className="PC-background">
			<div className="PC-card-labels-container">{labels}</div>
			<div className="PC-card-title-label">
				<p>Schedule new automation flow for the client</p>
			</div>
			<div className="PC-footer-container">
				<div className="PC-footer-notifications-container">{notifications}</div>
				<div className="PC-footer-assignments-container">{assignments}</div>
			</div>
		</div>
	);
});

export default Card;
