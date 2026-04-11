import { Firestore, getFirestore } from 'firebase-admin/firestore';
import { Auth, getAuth, TenantAwareAuth } from 'firebase-admin/auth';
import { getApps, initializeApp, App, AppOptions } from 'firebase-admin/app';
import { Injectable } from '@nestjs/common';
import { getStorage, Storage } from 'firebase-admin/storage';
import { Database, getDatabase } from 'firebase-admin/database';
import { credential } from 'firebase-admin';
import * as path from 'path';

@Injectable()
export class Firebase {
  private _firestore: Firestore;
  private _auth: Auth;
  private _storage: Storage;
  private _database: Database;
  private _app: App;

  constructor() {
    this.initializeFirebase();
  }

  /**
   * Get Firestore instance
   * @param {string} [databaseId] - Optional databaseId for the Firestore instance. Null databaseId will return the default instance.
   * @returns {Firestore} - Firestore instance
   * @memberof Firebase
   */
  public firestore(databaseId?: string): Firestore {
    return !databaseId ? this._firestore : getFirestore(this._app, databaseId);
  }

  /**
   * Get Auth instance
   * @param {string} [tenancyId] - Optional tenancyId for the Auth instance. Null tenancyId will return the default instance.
   * @returns {Auth} - Auth instance
   * @memberof Firebase
   */
  public auth(tenancyId?: string): Auth | TenantAwareAuth {
    return !tenancyId ? this._auth : this._auth.tenantManager().authForTenant(tenancyId);
  }

  public storage(): Storage {
    return this._storage;
  }

  /**
   * Get Realtime Database instance
   * @returns {Database} - Realtime Database instance
   * @memberof Firebase
   * @description The databaseURL is auto-detected from the service account's project_id.
   * Can be overridden via FIREBASE_DATABASE_URL environment variable.
   */
  public database(): Database {
    if (!this._database) {
      this._database = getDatabase(this._app);
    }
    return this._database;
  }

  public app(): App {
    return this._app;
  }

  /**
   * Initialize Firebase app
   * @returns {void}
   * @private
   * @memberof Firebase
   * @description
   * This method initializes the Firebase app with the provided configuration.
   * It checks if the app is already initialized and logs the name of the app.
   * If the app is not initialized, it creates a new app instance and sets up Firestore, Storage, and Auth services.
   * It also sets Firestore settings if provided in the configuration.
   */
  private initializeFirebase(): void {
    this.checkFirebaseApp();
    const appName = `app-${Math.random().toString(36).substring(7)}`;
    const firebaseConfig: AppOptions = this.getFirebaseConfig();
    const app = initializeApp(firebaseConfig, appName);
    if (!this._app?.name || this._app?.name === '' || this._app?.name !== app?.name) {
      this._app = app;
      this._firestore = getFirestore(app);
      this._storage = getStorage(app);
      this._auth = getAuth(app);

      if (process.env.FIRESTORE_SETTINGS) {
        this._firestore.settings(JSON.parse(process.env.FIRESTORE_SETTINGS));
      }
    }
  }

  /**
   * @returns {void}
   * @private
   * @memberof Firebase
   * Check if Firebase app is already initialized and log the name of the app
   */
  private checkFirebaseApp(): void {
    const apps = getApps();
    if (apps.length > 0) {
      const appName = apps.filter((app) => app.name !== '[DEFAULT]');
      if (appName.length > 0) {
        const names = appName.map((app) => app?.name);
        console.error('Error, Firebase app already initialized: ', names.join(', '));
      }
    }
  }

  /**
   * Get Firebase configuration
   * @returns {AppOptions}
   * @private
   * @memberof Firebase
   * @description
   * This method retrieves the Firebase configuration from the environment variables or service account key path.
   * It returns an AppOptions object containing the credential information.
   */

  private getFirebaseConfig(): AppOptions {
    const firebaseConfig: AppOptions = {
      credential: credential.applicationDefault(),
    };

    if (process.env.SERVICE_ACCOUNT_KEY) {
      firebaseConfig.credential = credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT_KEY));
    } else {
      firebaseConfig.credential = credential.cert(require(path.resolve(process.env.SERVICE_ACCOUNT_KEY_PATH)));
    }

    if (process.env.DATABASE_URL) {
      firebaseConfig.databaseURL = process.env.DATABASE_URL;
    }

    return firebaseConfig;
  }
}
