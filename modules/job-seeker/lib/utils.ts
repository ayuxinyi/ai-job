export const convertSearchparamsToString = (
  searchParamsObj: Record<string, string | string[]>
) => {
  const params = new URLSearchParams();
  Object.entries(searchParamsObj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => params.append(key, item));
    } else {
      params.set(key, value);
    }
  });
  return params.toString();
};
