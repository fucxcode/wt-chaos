const defaultValue = function <T>(value: () => Promise<T> | T) {
    return function (target: Function, key: string): any {

    };
};

export { defaultValue };