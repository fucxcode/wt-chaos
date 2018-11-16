import { IContainer, Lifecycles } from "../i-container";
declare const injectable: (container?: IContainer | undefined, lifecycle?: Lifecycles, type?: Function | Symbol | undefined) => (target: any) => any;
export { injectable };
