import { Container, Lifecycles } from "../container";
declare const injectable: (container?: Container | undefined, lifecycle?: Lifecycles, type?: Function | Symbol | undefined, postInstantiate?: ((instance: any) => void) | undefined) => (target: any) => any;
export { injectable };
