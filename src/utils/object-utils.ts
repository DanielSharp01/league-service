export function objectMap<T extends object, R>(obj: T, mapper: (value: T[keyof T], key: keyof T) => R) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k as keyof T, mapper(v, k as keyof T)])) as Record<keyof T, R>;
}

export function reverseMap<T extends Record<PropertyKey, PropertyKey>>(obj: T): Record<T[keyof T], keyof T> {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k])) as Record<T[keyof T], keyof T>;
}

export function pick<T extends object, S extends readonly (keyof T)[]>(row: T, ...columnKeys: S): Record<S[number], T[S[number]]>  {
  return Object.fromEntries(columnKeys.map(c => [c, row[c]])) as Record<S[number], T[S[number]]>;
}

export function removeUndefined<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([k, v]) => v !== undefined)) as any;
}