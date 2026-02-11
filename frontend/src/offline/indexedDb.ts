import { openDB } from "idb";

export const dbPromise = openDB("ambergrid-offline", 1, {
    upgrade(db) {
        db.createObjectStore("pending", {keyPath: "id"});
    },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveOffline(data: any) {
    const db = await dbPromise;
    await db.put("pending", data);
}