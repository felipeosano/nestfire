export { FirebaseHttps } from './decorators/firebase-https.decorator';
export * from './firebase/firebase';
export * from './firebase/firebase.module';
export * from './interfaces/firebase-https-configuration-v1.interface';
export * from './interfaces/firebase-https-configuration-v2.interface';
export * from './enums/firebase-function-version.enum';
export * from './interfaces/trigger.interface';
export * from './triggers/v1/event-trigger';
export * from './httpFunction/function-deploy';
export * from './triggers/index';

// Firebase
import * as admin from 'firebase-admin';
export { admin };
export * from 'firebase-functions';
