import axios from "axios";

export default axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
	headers: {
		"Content-type": "application/json",
	},
	withCredentials: true,
});
