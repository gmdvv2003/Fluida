import React, { useEffect, useImperativeHandle, useRef, useState } from "react";

import { ReactComponent as ChatBaloonIcon } from "assets/action-icons/chat-balloon.svg";
import { ReactComponent as ClockIcon } from "assets/action-icons/clock.svg";
import { ReactComponent as AttachmentIcon } from "assets/action-icons/attachment.svg";

import Label from "./components/label/Label";
import Notification from "./components/notification/Notification";
import Assignment from "./components/assignment/Assignment";

import LoadingDots from "components/shared/loading/LoadingDots";

import "./Card.css";
import DragableModal from "utilities/dragable-modal/DragableModal";

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

const Card = React.forwardRef(({ scrollableDivRef, isLoading, card, projectStateRef, projectSocketRef, callbacks }, ref) => {
	const isBeingDraggedExternalRef = useRef(false);

	const [labels, setLabels] = useState([]);
	const [notifications, setNotifications] = useState([]);
	const [assignments, setAssignments] = useState([]);

	const realRef = useRef(null);

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
			ref: realRef,
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
		<DragableModal
			getChild={(modal) => {
				return modal?.current?.children?.[0]?.children[1];
			}}
			// Referência para que indica se o modal está sendo arrastado
			isBeingDraggedExternalRef={isBeingDraggedExternalRef}
			// Referência para o div que pode ser arrastado
			scrollableDivRef={scrollableDivRef}
			// Ordem do modal
			order={card?.cardDTO?.order}
			// Elementos do modal
			elements={(isDragging) => (
				<div
					className={`PC-background ${isDragging && "PC-background-dragging"}`}
					onClick={() => {
						if (isBeingDraggedExternalRef.current) {
							return null;
						}

						projectStateRef.current?.previewCard(card);
					}}
					ref={realRef}
				>
					<div className="PC-background-container">
						{labels.length > 0 && (
							<div className="PC-card-labels-container">
								{labels.map(({ text, color }) => (
									<Label text={text} color={color} />
								))}
							</div>
						)}

						<div className={`PC-card-title-label ${labels.length <= 0 && "extended-PC-title-label"}`}>
							<p>{`${card?.cardDTO?.cardName} (#${card?.cardDTO?.cardId})`}</p>
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

					<button className="PC-drag" />
				</div>
			)}
			// Callbacks
			callbacks={callbacks}
			// Referência para o modal
			ref={ref}
			// Chave
			key={card?.cardDTO?.cardId}
		></DragableModal>
	);
});

export default Card;
