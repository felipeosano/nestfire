import { Change, CloudFunction, firestore } from 'firebase-functions/v1';

export interface Trigger {
  [key: string]: CloudFunction<Change<firestore.DocumentSnapshot>>;
}
