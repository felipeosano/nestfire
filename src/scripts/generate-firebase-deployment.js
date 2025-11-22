const fs = require('fs');
const path = require('path');

const projectRoot = process.env.INIT_CWD || process.cwd();

const outPath = path.join(projectRoot, 'index.ts');
const content = `/**
 * Auto-generated file by NestFire.
 *
 * firebaseFunctionsHttpsDeployment will deploy each NestJS module
 * annotated with \`@FirebaseHttps(EnumFirebaseFunctionVersion.V1, { memory: '256MB' })\`
 * as a separate Firebase Function. ⚠️ Do not delete.
 *
 * To deploy, run:
 *   firebase deploy --only functions
 *
 */

import { AppModule } from 'src/app.module';
import { firebaseFunctionsHttpsDeployment } from 'nestfire';
// Import additional triggers here

const httpsFunctions: Record<string, any> = firebaseFunctionsHttpsDeployment(AppModule);

module.exports = {
  ...httpsFunctions,
  // Add other exported functions here if needed (E.g., Firestore triggers, etc.)
};
`;

fs.writeFileSync(outPath, content, 'utf8');
console.log(`✔️  Generated ${path.relative(projectRoot, outPath)}`);
