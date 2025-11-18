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

const exportedFunctions: Record<string, any> = firebaseFunctionsHttpsDeployment(AppModule);
export default exportedFunctions;

/**
* 👇 If you want to deploy Firestore triggers, export them below:
* Example: export { orderTrigger } from './src/triggers/order/order.trigger';
* More examples: https://github.com/felipeosano/nestfire.git#firestore-trigger
*/
`;

fs.writeFileSync(outPath, content, 'utf8');
console.log(`✔️  Generated ${path.relative(projectRoot, outPath)}`);
