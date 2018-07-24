import { IContainer, lifecycles } from "../i-container";
declare const injectable: (container: IContainer, lifecycle?: lifecycles, type?: Function | Symbol | undefined) => (target: any) => any;
export { injectable };
