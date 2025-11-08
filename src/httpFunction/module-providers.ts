import 'reflect-metadata';
import { MODULE_METADATA } from '@nestjs/common/constants';
import { Type } from '@nestjs/common';
import { EnumFirebaseFunctionVersion } from '../enums/firebase-function-version.enum';

/**
 * Merges the providers from the app module into the target module.
 * @param appModule - The app module to merge providers from.
 * @param targetModule - The target module to merge providers into.
 */
export function mergeAppProvidersIntoModule(appModule: Type<any>, targetModule: Type<any>): void {
  const appProviders: any[] = Reflect.getMetadata(MODULE_METADATA.PROVIDERS, appModule) || [];
  const existing: any[] = Reflect.getMetadata(MODULE_METADATA.PROVIDERS, targetModule) || [];
  Reflect.defineMetadata(MODULE_METADATA.PROVIDERS, [...existing, ...appProviders], targetModule);
}

/**
 * Returns only the Firebase root modules (those decorated with @FirebaseHttps)
 * that are NOT imported by another decorated module.
 * This prevents adding global providers multiple times to the same dependency graph.
 * It does not modify any module metadata — it only reads it.
 */
export function pickModulesForGlobalProviders(modules: Type<any>[]): Type<any>[] {
  const result: Type<any>[] = [];

  for (const module of modules) {
    const imports: any[] = Reflect.getMetadata(MODULE_METADATA.IMPORTS, module) || [];
    if (pickModulesForGlobalProvidersRecursive(imports)) {
      result.push(module);
    }
  }

  return result;
}

function pickModulesForGlobalProvidersRecursive(imports: any[]): boolean {
  for (const importedModule of imports) {
    if (!importedModule) {
      continue;
    }

    const version = importedModule?.firebaseConfigurationVersion;

    if (version === EnumFirebaseFunctionVersion.V1 || version === EnumFirebaseFunctionVersion.V2) {
      return false;
    }

    const nestedImports: any[] = Reflect.getMetadata(MODULE_METADATA.IMPORTS, importedModule) || [];
    const ok = pickModulesForGlobalProvidersRecursive(nestedImports);
    if (!ok) {
      return false;
    }
  }

  return true;
}
