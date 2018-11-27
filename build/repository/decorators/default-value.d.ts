declare const defaultValue: <T>(value: () => T | Promise<T>) => (target: Function, key: string) => any;
export { defaultValue };
