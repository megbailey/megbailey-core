export function isCallableFunction<T extends (...args: never[]) => unknown>(
    func: unknown,
    _label = "Callback"
): func is T {
    return Boolean(func && typeof func === "function");
}