import { Container, Lifecycles } from "../container";
declare const injectable: (container?: Container | undefined, lifecycle?: Lifecycles, type?: Function | Symbol | undefined) => (target: any) => any;
export { injectable };
