export function populateObjectMaker(options: object[], mainObject?: object) {
  const result = mainObject || {};
  options.forEach((item) => {
    Object.keys(item).map(() => Object.assign(result, item));
  });
  return result;
}
