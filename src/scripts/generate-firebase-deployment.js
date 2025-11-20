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

const httpsFunctions: Record<string, any> = firebaseFunctionsHttpsDeployment(AppModule);
const exportedFunctions = {
  ...httpsFunctions,
  // Add other exported functions here if needed (E.g., Firestore triggers, etc.)
};

export default exportedFunctions;
export { exportedFunctions };
module.exports = exportedFunctions;

`;

fs.writeFileSync(outPath, content, 'utf8');
console.log(`✔️  Generated ${path.relative(projectRoot, outPath)}`);
