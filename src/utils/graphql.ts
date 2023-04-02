import { removeUndefined } from "./object-utils";

export function infoFields(info: any) {
  return info.fieldNodes[0].selectionSet.selections
    .map((f: any) => f.name.value);
}

export async function resolveQueryable<T extends object, R extends object>(
  queried: T,
  fields: string[],
  request: (queried: T) => Promise<R | undefined>,
  omittedKeys?: string[],
): Promise<R> {
  queried = removeUndefined(queried);
  const queriedKeys = Object.keys(queried);
  const queriableKeys = fields.filter((qa: string) => !queriedKeys.some((qd: string) => qd === qa) && !omittedKeys?.includes(qa));

  if (queriableKeys.length > 0) {
    return { ...queried, ...await request(queried) } as R & T;
  }

  return queried as R & T;
}