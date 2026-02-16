"use client";

import axios from "axios";
import { useTranslations } from "next-intl";
import React from "react";

import AlertNotification from "@/utils/alertNotification";

const PasswordChange = () => {
	const t = useTranslations("Profile");
	const tCommon = useTranslations("Common");
	const [newPassword, setNewPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === "newPassword") {
			setNewPassword(value);
		} else if (name === "confirmPassword") {
			setConfirmPassword(value);
		}
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			AlertNotification(t("passwordsDoNotMatch"), "error");
			return;
		}
		try {
			await axios.put("/api/auth/password-change", {
				newPassword,
				confirmPassword,
			});
			AlertNotification(t("passwordChanged"), "success");
			setNewPassword("");
			setConfirmPassword("");
		} catch (error: unknown) {
			AlertNotification(error as string, "error");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<label
					htmlFor="newPassword"
					className="text-sm font-medium text-foreground"
				>
					{t("newPassword")}
				</label>
				<input
					type="password"
					value={newPassword}
					id="newPassword"
					name="newPassword"
					onChange={handleChange}
					className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
				/>
			</div>
			<div className="space-y-2">
				<label
					htmlFor="confirmPassword"
					className="text-sm font-medium text-foreground"
				>
					{t("confirmNewPassword")}
				</label>
				<input
					type="password"
					value={confirmPassword}
					id="confirmPassword"
					name="confirmPassword"
					onChange={handleChange}
					className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
				/>
			</div>
			<button
				type="submit"
				className="inline-flex cursor-pointer items-center rounded-lg border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
			>
				{tCommon("save")}
			</button>
		</form>
	);
};

export default PasswordChange;
