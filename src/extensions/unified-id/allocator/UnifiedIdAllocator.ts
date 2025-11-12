export interface UnifiedIdAllocator {
  get(serviceId: string, userId: string): Promise<string>;
  save(unifiedId: string, serviceId: string, userId: string): Promise<void>;
  exists(params: { unifiedId: string }): Promise<string | undefined>;
  exists(params: {
    serviceId: string;
    userId: string;
  }): Promise<string | undefined>;
}
