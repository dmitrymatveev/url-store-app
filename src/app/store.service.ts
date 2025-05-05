import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private db: IDBDatabase | null = null;

  // Opens and prepears indexeddb
  private openUrlsDb(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      let openRequest = indexedDB.open('test', 1);
      openRequest.onupgradeneeded = function () {
        let db = openRequest.result;
        if (!db.objectStoreNames.contains('urls')) {
          db.createObjectStore('urls', { autoIncrement: true });
        }
      };

      openRequest.onerror = function () {
        reject(openRequest.error);
      };

      openRequest.onsuccess = function () {
        let db = openRequest.result;
        db.onversionchange = function () {
          db.close();
          alert('Database is outdated, please reload the page.');
        };
        resolve(db);
      };

      openRequest.onblocked = function () {
        // this event shouldn't trigger if we handle onversionchange correctly
        // it means that there's another open connection to the same database
        // and it wasn't closed after db.onversionchange triggered for it
        reject(new Error('blocked'));
      };
    });
  }

  /**
   * Add a url string to the store
   * @param url string to add
   */
  async addUrl(url: string) {
    // Open db connection once
    const db = this.db ?? (this.db = await this.openUrlsDb());
    // All operation use transactions
    const transaction = db.transaction('urls', 'readwrite');
    const urls = transaction.objectStore('urls');
    return new Promise((resolve, reject) => {
      const objectStoreRequest = urls.add({ url });
      objectStoreRequest.onsuccess = () => resolve(null);
      objectStoreRequest.onerror = (error) => reject(error);
    });
  }

  /**
   * @returns Store items count
   */
  async getSize(): Promise<number> {
    const db = this.db ?? (this.db = await this.openUrlsDb());
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('urls', 'readonly');
      const urls = transaction.objectStore('urls');
      const count = urls.count();
      count.onsuccess = () => resolve(count.result);
      count.onerror = () => reject(count.error);
    });
  }

  async clearAll(): Promise<void> {
    const db = this.db ?? (this.db = await this.openUrlsDb());
    const transaction = db.transaction('urls', 'readwrite');
    const urls = transaction.objectStore('urls');
    urls.clear();
  }

  /**
   * Returns paginates values
   * @param from starting index
   * @param count number of values to return
   * @returns stored values from up to count
   */
  async getValues(
    from: number,
    count: number = Number.MAX_SAFE_INTEGER
  ): Promise<string[]> {
    const db = this.db ?? (this.db = await this.openUrlsDb());
    const transaction = db.transaction('urls', 'readonly');
    const urls = transaction.objectStore('urls');
    return new Promise((resolve, reject) => {
      let paginated = false;
      const result = [] as string[];
      const cursor = urls.openCursor();
      cursor.onerror = function () {
        reject(cursor.error);
      };
      cursor.onsuccess = function () {
        let next = cursor.result;
        if (next) {
          if (!paginated && from > 0) {
            paginated = true;
            next.advance(from - 1);
            return;
          }
          result.push(next.value.url);
          if (result.length < count) {
            next.continue();
          } else {
            resolve(result);
          }
        } else {
          resolve(result);
        }
      };
    });
  }
}
