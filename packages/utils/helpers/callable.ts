export function isCallableFunction<T extends (...args: never[]) => unknown>(
    func: unknown,
    label = "Callback"
): func is T {
    if (func && typeof func === "function") {
        return true;
    }
    console.warn(`${label} prop is not a callable function.`);
    return false;
}