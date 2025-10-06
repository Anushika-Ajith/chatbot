import swaggerJsdoc from "swagger-jsdoc";

// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "Chatbot Backend API",
//       version: "1.0.0",
//       description: "Node.js + PostgreSQL backend with Swagger and Prisma",
//     },
//     servers: [{ url: "http://localhost:5000" }],
//   },
//   apis: ["./src/routes/*.js"], // Scan route files for Swagger comments
// };

// export const swaggerSpec = swaggerJsdoc(options);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Chatbot Backend API",
      version: "1.0.0",
      description: "Node.js + PostgreSQL backend with JWT Auth",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options); 