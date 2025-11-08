import express from 'express';
import { Express } from 'express-serve-static-core';
import compression from 'compression';
import { HttpsFunction, Request, Response, runWith, SUPPORTED_REGIONS } from 'firebase-functions/v1';
import { createFunction } from '../create-function';
// import { deleteImportedControllers } from '../delete-imported-controllers';
import { removePathFromSingleController } from '../url-prefix';
import { IFirebaseHttpsConfigurationV1 } from '../../interfaces/firebase-https-configuration-v1.interface';

/**
 * Creates a Firebase HTTPS function V1 with the specified memory and region.
 * @param {any} module - The NestJS module to be used for the function.
 * @param {RuntimeOptions} [runtimeOptions] - The runtime options for the function.
 * @param {string} [region] - The region for the function.
 * @param {boolean} [isolateControllers=true] - Whether to remove controllers from imported modules.
 * @returns {HttpsFunction} - The created Firebase HTTPS function.
 */
export function createFirebaseHttpsV1(
  module: any,
  runtimeOptions?: IFirebaseHttpsConfigurationV1,
  region?: string,
  isolateControllers: boolean = true
): HttpsFunction {
  validateRegion(region);

  const run = runWith(runtimeOptions ?? {});
  const runRegion = region ? run.region(region) : run;

  // if (isolateControllers) {  //TODO: Error, This delete controller in the main module as well, causing missing routes. --- IGNORE ---
  //   deleteImportedControllers(module);
  // }

  removePathFromSingleController(module);

  const expressServer: Express = express();
  expressServer.use(compression());

  return runRegion.https.onRequest(async (request: Request, response: Response) => {
    await createFunction(module, expressServer);
    expressServer(request, response);
  });
}

function validateRegion(region: string): void {
  if (!region) {
    return;
  }
  if (!Array < (typeof SUPPORTED_REGIONS).includes(region)) {
    throw new Error(`Unsupported region: ${region}.`);
  }
}
