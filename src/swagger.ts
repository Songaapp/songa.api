import { Express, Request, Response } from "express";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { version } from "../package.json";
import {userRoutesDocs} from './routes/users.docs'
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SONGA API DOCS",
      version: "1.0.0",
    },
    components: {
      securitySchemas: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development",
      },
      {
        url: "http://localhost:3000",
        description: "Production development",
      },
    ],
    tags: [
      {
        name: "Users",
        description: "All user routes: account creation, updating and deleting",
      },
      {
        name: "Riders",
        description:
          "All rider routes: account creation, updating and deleting",
      },
      {
        name: "CCA",
        description: "All user routes: account creation, updating and deleting",
      },
    ],
    paths: { ...userRoutesDocs, },
  },
  apis: ["./src/app.ts"],
};
const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: Number) {
  //swagger page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  //Docs in JSON format
  app.get("docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Docs available at http://localhost:${port}/docs`);
}
export default swaggerDocs;
