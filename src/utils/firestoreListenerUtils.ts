// src/utils/firestoreListenerUtils.ts
import {
    DocumentData,
    QuerySnapshot,
    DocumentSnapshot,
  } from "firebase/firestore";
  import { convertTimestampsToDates } from "./firebaseDateUtils"; // Asumsi path ini benar
  
  /**
   * Memproses QuerySnapshot dari Firestore, mengubah Timestamp menjadi Date,
   * dan memetakan data ke dalam array objek dengan ID dokumen.
   * @param snapshot QuerySnapshot dari Firestore.
   * @returns Array data yang sudah diproses.
   */
  export const processSnapshot = <TDataInterface extends { id?: string }>(
    snapshot: QuerySnapshot<DocumentData>
  ): TDataInterface[] => {
    const mappedData = snapshot.docs.map(
      (document: DocumentSnapshot<DocumentData>) => {
        const rawData = { id: document.id, ...document.data() };
        // Konversi semua Timestamp di rawData menjadi Date.
        return convertTimestampsToDates(rawData) as TDataInterface;
      }
    );
    return mappedData;
  };