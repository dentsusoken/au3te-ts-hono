/**
 * Represents an item stored in the database with optional expiration.
 * @template T - The type of data stored in the item.
 */
export interface StoreItem<T> {
  /** The actual data to store */
  data: T;
  /** Optional expiration timestamp in milliseconds since epoch */
  expiresAt?: number;
}

/**
 * Generic database interface for storing and retrieving typed data.
 * @template T - The type of data stored in the database.
 */
export interface Database<T> {
  /**
   * Saves an item to the database.
   * @param {string} key - The key to store the item under.
   * @param {StoreItem<T>} item - The item to store, including data and optional expiration.
   * @returns {Promise<void>} A promise that resolves when the save operation completes.
   */
  save(key: string, item: StoreItem<T>): Promise<void>;

  /**
   * Retrieves an item from the database.
   * @param {string} key - The key to retrieve the item for.
   * @returns {Promise<T | undefined>} A promise that resolves to the stored data, or undefined if not found.
   */
  get(key: string): Promise<T | undefined>;
}
