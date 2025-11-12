export interface StoreItem<T> {
  data: T;
  expiresAt?: number;
}

export interface Database<T> {
  save(key: string, item: StoreItem<T>): Promise<void>;
  get(key: string): Promise<T | undefined>;
}
