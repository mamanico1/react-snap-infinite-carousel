export function debounce(func: any, delay: number) {
  let inDebounce;
  return function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    // @ts-ignore
    const context = this;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => func.apply(context, args), delay);
  };
}
