import BasicAuth from 'express-basic-auth';
import {
  MicroframeworkLoader,
  MicroframeworkSettings
} from 'microframework';
import Swaggerjsdoc from 'swagger-jsdoc';
import Swaggeruiexpress from 'swagger-ui-express';
import config from '../config/config';
import { Next, Request, Response } from './../types/express.extensions';

export const publicLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined
) => {
  if (settings && config.SWAGGER_ENABLED) {
    const expressApp = settings.getData('express_app');

    // api routes
    const routesPath =
      config.NODE_ENV == 'local'
        ? './server/api/controllers/v1/*/*.route.ts'
        : './dist/api/controllers/v1/*/*.route.js';

    // swagger definitions
    const swaggerDefinition = {
      openapi: '3.0.1',
      info: {
        title: config.APP_NAME,
        version: '1.0.0',
        description: 'Newman API Server Documentation',
        license: {
          name: 'Aman Nidhi',
          url: 'https://www.aman.com'
        },

        type: 'application/json',
        host: 'localhost:3000'
      },
      basePath: '/api/v1',
      servers: [
        {
          url: config.ROUTE_URL_V1,
          description: 'v1'
        }
      ],
      components: {
        securitySchemes: {
          JwtTokenAuth: {
            type: 'http',
            scheme: 'bearer'
          }
        }
      }
    };

    const options = {
      swaggerDefinition,
      apis: [routesPath]
    };

    const swaggerdocs = Swaggerjsdoc(options);

    expressApp.use(
      config.SWAGGER_ROUTE,

      // do not ask password when in local
      config.NODE_ENV == 'local'
        ? BasicAuth({
            users: {
              [`${config.SWAGGER_USERNAME}`]: config.SWAGGER_PASSWORD
            },
            challenge: true
          })
        : (req: Request, res: Response, next: Next) => next(),
      Swaggeruiexpress.serve,
      Swaggeruiexpress.setup(swaggerdocs)
    );

    // swagger in the route
    expressApp.get(config.SWAGGER_SPEC, (req: Request, res: Response) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(swaggerdocs, null, 1));
    });
  }
};
