import type { Request, Response } from "express";
import type { NextApiRequest, NextApiResponse } from "next";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "@/lib/swagger";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		swaggerUi.setup(swaggerSpec)(
			req as unknown as Request,
			res as unknown as Response,
			() => {},
		);
	} else {
		res.setHeader("Allow", ["GET"]);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
