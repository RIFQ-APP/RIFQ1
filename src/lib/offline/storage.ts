/**
 * تخزين محلي لمحتوى RIFQ الذي يختاره المستخدم للعمل دون إنترنت.
 * لا تستخدم هذه القاعدة لتخزين كلمات المرور أو رموز الجلسات.
 */
const DB_NAME = "rifq-offline";
const DB_VERSION = 1;
const STORE_NAME = "content";

export interface OfflineRecord<T = unknown> {
  id: string;
  section: string;
  version: string;
  savedAt: number;
  data: T;
}

function openDatabase(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("التخزين المحلي غير متاح في هذه البيئة."));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("section", "section", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("تعذّر فتح التخزين المحلي."));
  });
}

export async function saveOfflineRecord<T>(record: OfflineRecord<T>): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("تعذّر حفظ المحتوى."));
    tx.onabort = () => reject(tx.error ?? new Error("تم إلغاء حفظ المحتوى."));
  });
  db.close();
}

export async function getOfflineRecord<T>(id: string): Promise<OfflineRecord<T> | null> {
  const db = await openDatabase();
  const result = await new Promise<OfflineRecord<T> | null>((resolve, reject) => {
    const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).get(id);
    request.onsuccess = () => resolve((request.result as OfflineRecord<T> | undefined) ?? null);
    request.onerror = () => reject(request.error ?? new Error("تعذّر قراءة المحتوى."));
  });
  db.close();
  return result;
}

export async function getOfflineRecordsBySection<T>(section: string): Promise<OfflineRecord<T>[]> {
  const db = await openDatabase();
  const result = await new Promise<OfflineRecord<T>[]>((resolve, reject) => {
    const request = db.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME).index("section").getAll(section);
    request.onsuccess = () => resolve((request.result as OfflineRecord<T>[]) ?? []);
    request.onerror = () => reject(request.error ?? new Error("تعذّرت قراءة محتويات القسم."));
  });
  db.close();
  return result;
}

export async function deleteOfflineRecord(id: string): Promise<void> {
  const db = await openDatabase();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("تعذّر حذف المحتوى."));
  });
  db.close();
}
