// src/utils/firebaseDateUtils.ts
import { Timestamp, DocumentData } from "firebase/firestore";

/**
 * Tipe helper rekursif untuk mengubah properti Date atau Date | undefined
 * menjadi Timestamp atau Timestamp | undefined.
 */
export type ObjectWithTimestamps<T> = T extends Date
  ? Timestamp
  : T extends Date | undefined
  ? Timestamp | undefined
  : T extends null
  ? null
  : T extends ReadonlyArray<infer U> // Menangani ReadonlyArray
  ? Array<ObjectWithTimestamps<U>> // Hasilnya Array yang mutable
  : T extends Array<infer U>
  ? Array<ObjectWithTimestamps<U>>
  : T extends object
  ? { -readonly [P in keyof T]: ObjectWithTimestamps<T[P]> } // Properti hasil mutable
  : T;

/**
 * Tipe helper rekursif untuk mengubah properti Timestamp atau Timestamp | undefined
 * menjadi Date atau Date | undefined.
 */
export type ObjectWithDates<T> = T extends Timestamp
  ? Date
  : T extends Timestamp | undefined
  ? Date | undefined
  : T extends null
  ? null
  : T extends ReadonlyArray<infer U> // Menangani ReadonlyArray
  ? Array<ObjectWithDates<U>> // Hasilnya Array yang mutable
  : T extends Array<infer U>
  ? Array<ObjectWithDates<U>>
  : T extends object
  ? { -readonly [P in keyof T]: ObjectWithDates<T[P]> } // Properti hasil mutable
  : T;

export function convertDatesToTimestamps<T>(data: T): ObjectWithTimestamps<T> {
  if (data instanceof Date) {
    return Timestamp.fromDate(data) as ObjectWithTimestamps<T>;
  }

  if (data === null || typeof data !== "object") {
    return data as ObjectWithTimestamps<T>;
  }

  if (Array.isArray(data)) {
    // 'item' akan memiliki tipe elemen dari array 'data'.
    // Jika 'data' adalah 'X[]', maka 'item' adalah 'X'.
    return data.map((item) =>
      convertDatesToTimestamps(item)
    ) as ObjectWithTimestamps<T>;
  }

  // Jika data adalah objek generik
  const result = {} as { [P in keyof T]: ObjectWithTimestamps<T[P]> };
  for (const key of Object.keys(data as object) as Array<keyof T>) {
    // Object.prototype.hasOwnProperty.call sebenarnya tidak diperlukan
    // jika menggunakan Object.keys secara langsung pada objek 'data'.
    // Namun, untuk lebih aman jika 'data' memiliki properti dari prototype:
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      result[key] = convertDatesToTimestamps(data[key]);
    }
  }
  return result as ObjectWithTimestamps<T>;
}

export function convertTimestampsToDates<TInputType>(
  data: TInputType | DocumentData
): ObjectWithDates<TInputType> {
  if (data instanceof Timestamp) {
    return data.toDate() as ObjectWithDates<TInputType>;
  }

  if (data === null || typeof data !== "object") {
    return data as ObjectWithDates<TInputType>;
  }

  if (Array.isArray(data)) {
    // Jika 'data' adalah sebuah array, maka 'data' PASTI merupakan TInputType
    // (karena DocumentData bukanlah array).
    // Jadi, TInputType adalah sebuah tipe array, misal ElementType[].
    // Maka 'item' akan bertipe ElementType.
    return (data as unknown[]).map((item: unknown) => // item di-treat sebagai unknown
      convertTimestampsToDates(item) // TInputType rekursif akan menjadi unknown
    ) as unknown as ObjectWithDates<TInputType>; // Cast akhir
  }

  // Jika data adalah objek generik (bisa TInputType atau DocumentData)
  const result = {} as ObjectWithDates<TInputType>;
  // Menggunakan Record<string, unknown> untuk menghindari 'any' secara eksplisit saat iterasi.
  const objectToIterate = data as Record<string, unknown>;

  for (const key of Object.keys(objectToIterate)) {
    // `value` akan bertipe `unknown` jika `objectToIterate` ditangani sebagai `Record<string, unknown>`.
    // NAMUN, jika `data` ASLINYA adalah `DocumentData`, maka `objectToIterate[key]`
    // (atau lebih tepatnya `(data as DocumentData)[key]`) akan bertipe `any`
    // karena definisi `DocumentData` itu sendiri.
    const value = objectToIterate[key];

    // Panggilan rekursif:
    // Jika `value` menjadi `any` (karena berasal dari DocumentData), maka TInputType
    // dalam panggilan rekursif `convertTimestampsToDates(value)` akan diinfer menjadi `any`.
    // Hasilnya, `ObjectWithDates<any>` adalah `any`.
    // Jika `value` adalah `unknown`, maka TInputType rekursif adalah `unknown`, dan hasilnya `unknown`.
    (result as Record<string, unknown>)[key] = convertTimestampsToDates(value);
  }
  return result;
}