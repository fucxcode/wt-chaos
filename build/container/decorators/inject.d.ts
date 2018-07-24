import { IContainer } from "../i-container";
declare const inject: (container: IContainer, throwErrorUnregister?: boolean, type?: Function | Symbol | undefined, lazy?: boolean) => (...args: any[]) => any;
export { inject };
