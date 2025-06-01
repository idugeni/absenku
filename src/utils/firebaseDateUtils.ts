import { Timestamp, DocumentData } from "firebase/firestore";

export type ObjectWithTimestamps<T> = T extends Date
  ? Timestamp
  : T extends Date | undefined
  ? Timestamp | undefined
  : T extends null
  ? null
  : T extends ReadonlyArray<infer U>
  ? Array<ObjectWithTimestamps<U>>
  : T extends Array<infer U>
  ? Array<ObjectWithTimestamps<U>>
  : T extends object
  ? { -readonly [P in keyof T]: ObjectWithTimestamps<T[P]> }
  : T;

export type ObjectWithDates<T> = T extends Timestamp
  ? Date
  : T extends Timestamp | undefined
  ? Date | undefined
  : T extends null
  ? null
  : T extends ReadonlyArray<infer U>
  ? Array<ObjectWithDates<U>>
  : T extends Array<infer U>
  ? Array<ObjectWithDates<U>>
  : T extends object
  ? { -readonly [P in keyof T]: ObjectWithDates<T[P]> }
  : T;

/**
 * Mengubah semua instance `Date` dalam sebuah objek atau array menjadi `Timestamp` Firestore secara rekursif.
 * Properti `readonly` pada tipe input akan diubah menjadi `mutable` pada tipe output.
 *
 * @template T Tipe data input yang akan diproses.
 * @param data Data yang mungkin berisi objek `Date`.
 * @returns Data dengan semua objek `Date` dikonversi menjadi `Timestamp`.
 */
export function convertDatesToTimestamps<T>(data: T): ObjectWithTimestamps<T> {
  if (data instanceof Date) {
    return Timestamp.fromDate(data) as ObjectWithTimestamps<T>;
  }

  if (data === null || typeof data !== "object") {
    return data as ObjectWithTimestamps<T>;
  }

  if (Array.isArray(data)) {
    return data.map((item) =>
      convertDatesToTimestamps(item)
    ) as ObjectWithTimestamps<T>;
  }

  const result = {} as { [P in keyof T]: ObjectWithTimestamps<T[P]> };
  for (const key of Object.keys(data as object) as Array<keyof T>) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      result[key] = convertDatesToTimestamps(data[key]);
    }
  }
  return result as ObjectWithTimestamps<T>;
}

/**
 * Mengubah semua instance `Timestamp` Firestore dalam sebuah objek atau array menjadi objek `Date` secara rekursif.
 * Fungsi ini menangani objek `DocumentData` dari Firestore dan tipe input kustom.
 * Properti `readonly` pada tipe input akan diubah menjadi `mutable` pada tipe output.
 *
 * @template TInputType Tipe data input yang akan diproses.
 * @param data Data yang mungkin berisi `Timestamp` Firestore. Bisa berupa tipe kustom atau `DocumentData`.
 * @returns Data dengan semua objek `Timestamp` dikonversi menjadi `Date`.
 */
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
    return (data as unknown[]).map((item: unknown) =>
      convertTimestampsToDates(item)
    ) as unknown as ObjectWithDates<TInputType>;
  }

  const result = {} as ObjectWithDates<TInputType>;
  const objectToIterate = data as Record<string, unknown>;

  for (const key of Object.keys(objectToIterate)) {
    const value = objectToIterate[key];
    (result as Record<string, unknown>)[key] = convertTimestampsToDates(value);
  }
  return result;
}