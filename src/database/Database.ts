import { initializeApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { DatabaseTypes } from "./types";
import { firebaseConfig } from "./firebaseConfig";

enum COLLECTIONS {
  PROVIDER_SNAPSHOTS = "providerSnapshots",
}

export class Database {
  private db: Firestore;

  constructor() {
    this.db = getFirestore(initializeApp(firebaseConfig));
  }

  getProviderDataSnapshot = async (
    providerID: string
  ): Promise<DatabaseTypes.IProviderData | null> => {
    const docSnap = await getDoc(
      doc(this.db, COLLECTIONS.PROVIDER_SNAPSHOTS, providerID)
    );

    return docSnap.exists()
      ? (docSnap.data() as DatabaseTypes.IProviderData)
      : null;
  };

  setProviderDataSnapshot = async (
    input: DatabaseTypes.IProviderData
  ): Promise<void> => {
    await setDoc(
      doc(this.db, COLLECTIONS.PROVIDER_SNAPSHOTS, input.id),
      input,
      {
        merge: true,
      }
    );
  };
}
