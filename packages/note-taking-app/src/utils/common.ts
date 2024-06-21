/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce(func: (...args: any[]) => any, delay: number, leading = false) {
  let timerId: ReturnType<typeof setTimeout>;

  return (...args: unknown[]) => {
    if (!timerId && leading) {
      func(...args);
    }
    clearTimeout(timerId);

    timerId = setTimeout(() => func(...args), delay);
  };
}

export function capitalize(str: string): string {
   if (str.includes(' ')) {
     return str.split(' ').map(capitalize).join(' ');
   }

  return str.length > 1 ? `${str[0].toUpperCase()}${str.slice(1)}` : str.toUpperCase();
}
