import { Container } from "../container";
declare const inject: (container?: Container | undefined, throwErrorUnregister?: boolean, type?: Function | Symbol | undefined, lazy?: boolean) => (...args: any[]) => any;
export { inject };
