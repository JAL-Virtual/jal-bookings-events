export function useFlatInfiniteData<T>(data: Array<{ data: T[] }> | undefined): T[] {
  if (!data) return [];
  
  return data.reduce<T[]>((acc, page) => {
    return [...acc, ...page.data];
  }, []);
}
