import axios from "axios";
import React from "react";

import AlertNotification from "@/utils/alertNotification";

const PasswordChange = () => {
	const [oldPassword, setOldPassword] = React.useState("");
	const [newPassword, setNewPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === "oldPassword") {
			setOldPassword(value);
		} else if (name === "newPassword") {
			setNewPassword(value);
		} else if (name === "confirmPassword") {
			setConfirmPassword(value);
		}
	};

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (newPassword !== confirmPassword) {
			AlertNotification("Şifreler uyuşmuyor", "success");

			return;
		}
		try {
			await axios.put("/api/auth/password-change", {
				oldPassword,
				newPassword,
				confirmPassword,
			});
			AlertNotification("Şifre başarıyla değiştirildi", "success");
		} catch (error: unknown) {
			AlertNotification(error as string, "error");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col w-full rounded-md bg-gray-100 p-5 space-y-3 text-sm"
		>
			<p className="font-bold text-primary text-base">Şifre Değiştir</p>
			<div className="flex flex-col">
				<label htmlFor="old-password" className="mr-3">
					Eski Şifre:
				</label>
				<input
					type="password"
					value={oldPassword}
					id="oldPassword"
					name="oldPassword"
					onChange={handleChange}
					className="w-full p-2 border border-gray-300 rounded-md text-sm"
				/>
			</div>
			<div className="flex flex-col">
				<label htmlFor="new-password" className="mr-3">
					Yeni Şifre:
				</label>
				<input
					onChange={handleChange}
					type="password"
					value={newPassword}
					id="newPassword"
					name="newPassword"
					className="w-full p-2 border border-gray-300 rounded-md text-sm"
				/>
			</div>
			<div className="flex flex-col">
				<label htmlFor="confirm-password" className="mr-3">
					Yeni Şifre Tekrar:
				</label>
				<input
					onChange={handleChange}
					type="password"
					value={confirmPassword}
					id="confirmPassword"
					name="confirmPassword"
					className="w-full p-2 border border-gray-300 rounded-md text-sm"
				/>
			</div>
			<button
				type="submit"
				className="text-primary font-bold px-4 py-2 text-sm flex items-center justify-center space-x-3 border border-primary rounded-md bg-white hover:bg-primary hover:text-white"
			>
				<p>Kaydet</p>
			</button>
		</form>
	);
};

export default PasswordChange;
