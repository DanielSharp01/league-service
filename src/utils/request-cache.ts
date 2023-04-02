export function setupCache(context: any) {
  context.cache = new RequestContextCache();
}

export class RequestContextCache {
  private map = new Map<string, Promise<any>>();

  getEntry<T = any>(key: any[]): Promise<T> | undefined {
    if (key.some(k => k === undefined)) return undefined;

    return this.map.get(getCacheKey(key)) as Promise<T> | undefined;
  }

  setEntry(key: any[], value: any) {
    this.map.set(getCacheKey(key), Promise.resolve(value));
  }

  setRequest<T>(key: any[], promise: Promise<T>) {
    this.map.set(getCacheKey(key), promise);
    return promise;
  }
}

function getCacheKey(key: any[]) {
  return key.map(k => k.toString()).join(':')
}

export type CacheContext = { cache: RequestContextCache };