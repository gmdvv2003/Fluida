import React, { useEffect, useImperativeHandle, useState } from "react";

import { ReactComponent as ChatBaloonIcon } from "assets/action-icons/chat-balloon.svg";
import { ReactComponent as ClockIcon } from "assets/action-icons/clock.svg";
import { ReactComponent as AttachmentIcon } from "assets/action-icons/attachment.svg";

import Label from "./components/label/Label";
import Notification from "./components/notification/Notification";
import Assignment from "./components/assignment/Assignment";

import LoadingDots from "components/shared/loading/LoadingDots";

import "./Card.css";

class LabelMetadata {
	title;
	color;

	constructor(title, color) {
		this.title = title;
		this.color = color;
	}
}

class NotificationMetadata {
	Icon;
	text;

	constructor(Icon, text) {
		this.Icon = Icon;
		this.text = text;
	}
}

class AssignmentMetadata {}

const Card = React.forwardRef(({ scrollableDivRef, isLoading, card, projectState, projectSocketRef, callbacks }, ref) => {
	const [labels, setLabels] = useState([]);
	const [notifications, setNotifications] = useState([]);
	const [assignments, setAssignments] = useState([]);

	function addLabel(title, color) {
		setLabels((labels) => [...labels, new LabelMetadata(title, color)]);
	}

	function removeLabel(title) {
		setLabels(labels.filter((label) => label.title !== title));
	}

	function addNotification(Icon, text) {
		setNotifications((notifications) => [...notifications, new NotificationMetadata(Icon, text)]);
	}

	function removeNotification(Icon) {
		setNotifications(notifications.filter((notification) => notification.Icon == Icon));
	}

	function addAssignment(user) {}
	function removeAssignment(user) {}

	useImperativeHandle(
		ref,
		() => ({
			addLabel,
			removeLabel,
			addNotification,
			removeNotification,
			addAssignment,
			removeAssignment,
			ref: scrollableDivRef,
		}),
		[]
	);

	useEffect(() => {
		addNotification(AttachmentIcon, "0");
		addNotification(ChatBaloonIcon, "0");

		return () => {
			removeNotification(AttachmentIcon);
			removeNotification(ChatBaloonIcon);
		};
	}, []);

	if (isLoading || !card) {
		return (
			<div className="PC-background">
				<div className="PC-center-lock">
					<LoadingDots scale={0.7} />
				</div>
			</div>
		);
	}

	return (
		<div
			className="PC-background"
			onClick={() => {
				projectState.current?.previewCard(card);
			}}
		>
			{labels.length > 0 && (
				<div className="PC-card-labels-container">
					{labels.map(({ text, color }) => (
						<Label text={text} color={color} />
					))}
				</div>
			)}

			<div className={`PC-card-title-label ${labels.length <= 0 && "extended-PC-title-label"}`}>
				<p>{card?.cardDTO?.title}</p>
			</div>

			<div className="PC-footer-container">
				<div className="PC-footer-notifications-container">
					{notifications.map(({ Icon, text }) => (
						<Notification Icon={Icon} text={text} />
					))}
				</div>

				<div className="PC-footer-assignments-container">{assignments}</div>
			</div>
		</div>
	);
});

export default Card;
