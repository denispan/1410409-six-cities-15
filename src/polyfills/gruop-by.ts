if (!('groupBy' in Object)) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Object.groupBy = <K extends PropertyKey, T>(items: Iterable<T>, getKey: (item: T, index: number) => K): Partial<Record<K, T[]>> =>
    Array.from(items).reduce(
      (result, item, index) => {
        const key = getKey(item, index);
        result[key] = result[key] ?? [];
        result[key]!.push(item);

        return result;
      },
      {} as Partial<Record<K, T[]>>
    );
}
