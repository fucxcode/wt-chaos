interface IActivationHandler {
    handle<T extends object>(instance: T): T;
}
export { IActivationHandler };
