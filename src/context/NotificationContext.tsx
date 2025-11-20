"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

import { AlertNotification } from "@/components/shared/AlertNotification";

type AlertType = "success" | "error";

interface NotificationContextType {
	// eslint-disable-next-line no-unused-vars
	showNotification: (message: string, type: AlertType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
	undefined,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
	const [notification, setNotification] = useState<{
		message: string;
		type: AlertType;
		show: boolean;
	} | null>(null);

	const showNotification = (message: string, type: AlertType) => {
		setNotification({ message, type, show: true });
		setTimeout(() => {
			setNotification(null);
		}, 3000);
	};

	return (
		<NotificationContext.Provider value={{ showNotification }}>
			{children}
			{notification && (
				<AlertNotification
					message={notification.message}
					type={notification.type}
				/>
			)}
		</NotificationContext.Provider>
	);
}

export function useNotification() {
	const context = useContext(NotificationContext);
	if (context === undefined) {
		throw new Error(
			"useNotification must be used within a NotificationProvider",
		);
	}

	return context;
}
