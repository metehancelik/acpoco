import { NextResponse } from "next/server";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "@/lib/swagger";

export async function GET() {
  const html = swaggerUi.generateHTML(swaggerSpec);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
