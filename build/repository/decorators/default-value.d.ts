declare const defaultValue: <T>(value: () => T, arrayGenericType?: Function | undefined) => (target: any, propertyKey: string) => any;
declare const applyDefaultValues: <T extends Object>(type: Function, object: T) => T;
export { defaultValue, applyDefaultValues };
