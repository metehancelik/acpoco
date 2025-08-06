import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SAGE API Documentation",
      version: "1.0.0",
      description: "API documentation for the SAGE application",
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
        description: "API Server",
      },
    ],
  },
  apis: ["./src/app/api/**/*.ts", "./src/app/api/swagger-docs.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
