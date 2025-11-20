export function formatDate(dateString: string) {
	const months = [
		"Ocak",
		"Şubat",
		"Mart",
		"Nisan",
		"Mayıs",
		"Haziran",
		"Temmuz",
		"Ağustos",
		"Eylül",
		"Ekim",
		"Kasım",
		"Aralık",
	];

	const date = new Date(dateString);
	const day = date.getUTCDate();
	const month = months[date.getUTCMonth()];
	const year = date.getUTCFullYear();
	const hour = date.getUTCHours();
	const minute = date.getUTCMinutes();

	const paddedDay = day.toString().padStart(2, "0");
	const paddedHour = hour.toString().padStart(2, "0");
	const paddedMinute = minute.toString().padStart(2, "0");

	return `${paddedDay} ${month} ${year} - ${paddedHour}:${paddedMinute}`;
}

export function formatDateTR(dateString: string) {
	const months = [
		"Ocak",
		"Şubat",
		"Mart",
		"Nisan",
		"Mayıs",
		"Haziran",
		"Temmuz",
		"Ağustos",
		"Eylül",
		"Ekim",
		"Kasım",
		"Aralık",
	];

	const date = new Date(dateString);
	const day = date.getDate();
	const month = months[date.getMonth()];
	const year = date.getFullYear();
	const hour = date.getHours();
	const minute = date.getMinutes();

	const paddedDay = day.toString().padStart(2, "0");
	const paddedHour = hour.toString().padStart(2, "0");
	const paddedMinute = minute.toString().padStart(2, "0");

	return `${paddedDay} ${month} ${year} - ${paddedHour}:${paddedMinute}`;
}

export function formatDuration(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.round(seconds % 60);

	return `${minutes} dk. ${remainingSeconds.toString().padStart(2, "0")} sn`;
}

export const formatDate3 = (date: string): string => {
	const newDate = new Date(date);

	return newDate.toLocaleString("tr-TR", { timeZone: "Europe/Istanbul" });
};

export function formatMonthYearTR(dateString: string): string {
	const months = [
		"Ocak",
		"Şubat",
		"Mart",
		"Nisan",
		"Mayıs",
		"Haziran",
		"Temmuz",
		"Ağustos",
		"Eylül",
		"Ekim",
		"Kasım",
		"Aralık",
	];

	const date = new Date(dateString);
	const month = months[date.getMonth()];
	const year = date.getFullYear();

	return `${month} ${year}`;
}
