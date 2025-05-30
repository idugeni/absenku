// src/hooks/useAppFirestore.ts
import {
    useFirestoreBackup,
    UseFirestoreBackupReturn,
  } from "@/hooks/useFirestoreBackup";
  import { usePegawaiStore, UsePegawaiStoreReturn, Pegawai } from "@/hooks/usePegawaiStore";
  import { useEventStore, UseEventStoreReturn } from "@/hooks/useEventStore";
  import {
    useAttendanceStore,
    UseAttendanceStoreReturn,
  } from "@/hooks/useAttendanceStore";
  import {
    useUserProfileStore,
    UseUserProfileStoreReturn,
  } from "@/hooks/useUserProfileStore";
  
  // Gabungkan semua tipe return dari hook individual
  export interface AppFirestoreReturn
    extends UseFirestoreBackupReturn,
      UsePegawaiStoreReturn,
      UseEventStoreReturn,
      UseAttendanceStoreReturn,
      UseUserProfileStoreReturn {}
  
  export const useAppFirestore = (): AppFirestoreReturn => {
    const backupManager = useFirestoreBackup();
    const pegawaiStore = usePegawaiStore();
    const eventStore = useEventStore();
    const attendanceStore = useAttendanceStore();
    const userProfileStore = useUserProfileStore();
  
    return {
      ...backupManager,
      ...pegawaiStore,
      ...eventStore,
      ...attendanceStore,
      ...userProfileStore,
    };
  };

export type { Pegawai };
