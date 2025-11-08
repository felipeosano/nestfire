import express from 'express';
import { Express } from 'express-serve-static-core';
import compression from 'compression';
import { HttpsFunction, onRequest } from 'firebase-functions/v2/https';
import { createFunction } from '../create-function';
// import { deleteImportedControllers } from '../delete-imported-controllers';
import { IFirebaseHttpsConfigurationV2 } from '../../interfaces/firebase-https-configuration-v2.interface';
import { removePathFromSingleController } from '../url-prefix';

/**
 * Creates a Firebase HTTPS function with the specified memory and region.
 * @param {any} module - The NestJS module to be used for the function.
 * @param {HttpsOptions} httpsOptions - The options for the HTTPS function.
 * @param {boolean} [isolateControllers=true] - Whether to remove controllers from imported modules.
 * @returns {HttpsFunction} - The created Firebase HTTPS function.
 */
export function createFirebaseHttpsV2(module: any, httpsOptions?: IFirebaseHttpsConfigurationV2, isolateControllers: boolean = true): HttpsFunction {
  // if (isolateControllers) {  //TODO: Error, This delete controller in the main module as well, causing missing routes. --- IGNORE ---
  //   deleteImportedControllers(module);
  // }

  if (httpsOptions?.removeControllerPrefix) {
    removePathFromSingleController(module);
  }

  const expressServer: Express = express();
  expressServer.use(compression());

  return onRequest(httpsOptions ?? {}, async (req, res) => {
    await createFunction(module, expressServer);
    expressServer(req, res);
  });
}
