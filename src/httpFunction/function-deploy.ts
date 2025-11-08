import { EnumFirebaseFunctionVersion } from '../enums/firebase-function-version.enum';
import { getUrlPrefix } from './url-prefix';
import { mergeAppProvidersIntoModule, pickModulesForGlobalProviders } from './module-providers';
import { scanFirebaseModules } from './scan-firebase-module';
import { createFirebaseHttpsV1 } from './v1/firebase-http-function.v1';
import { createFirebaseHttpsV2 } from './v2/firebase-http-function.v2';
import type { HttpsFunction } from 'firebase-functions/v1';
import { logInfo, logError } from '../logs/logs';

/**
 * Creates Firebase HTTPS functions for deployment.
 * @param appModule - The NestJS module to scan for Firebase modules.
 * @returns An object mapping function names to their corresponding Firebase HTTPS functions.
 **/
export function firebaseFunctionsHttpsDeployment(appModule: any): Record<string, HttpsFunction> {
  const firebaseModules = scanFirebaseModules(appModule);
  const functions: Record<string, any> = {};

  const modulesToAddProviders = pickModulesForGlobalProviders(firebaseModules.map((fm) => fm.module));
  for (const module of modulesToAddProviders) {
    mergeAppProvidersIntoModule(appModule, module);
  }

  for (const module of firebaseModules) {
    const name = getUrlPrefix(module.module, module.configuration);
    logInfo(`Creating function for module: ${module.module.name}, function name: ${name}`);
    functionNames.push(name);
    const func =
      module.configuration.version === EnumFirebaseFunctionVersion.V2
        ? createFirebaseHttpsV2(module.module, module.configuration.configV2)
        : createFirebaseHttpsV1(module.module, module.configuration.configV1);
    functions[name] = func;
  }

  checkDuplicateFunctionNames(functions);
  return functions;
}

export const functionNames: string[] = [];
export function checkDuplicateFunctionNames(functions: Record<string, HttpsFunction>): void {
  const functionNames = Object.keys(functions);
  const nameSet = new Set<string>();

  for (const name of functionNames) {
    if (nameSet.has(name)) {
      logError(`Duplicate function name detected: ${name}. Function names must be unique.`);
      throw new Error(`[NESTFIRE] - Duplicate function name detected: ${name}. Function names must be unique.`);
    }
    nameSet.add(name);
  }
}
