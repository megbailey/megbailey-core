import { useRef, useCallback } from "react";

function trackPromise(promise: Promise<boolean>) {
    let isPending = true;
    promise.finally(() => (isPending = false));

    return {
        promise: promise,
        isPending: () => isPending,
    };
}

type TrackedPromise = {
    promise: Promise<boolean>;
    isPending: () => boolean;
};

const usePromises = () => {
    const promisesRef = useRef<TrackedPromise[]>([]);

    const addPromise = useCallback((promise: Promise<boolean>) => {
        const tracked = trackPromise(promise);
        promisesRef.current.push(tracked);

        tracked.promise.finally(() => {
            promisesRef.current = promisesRef.current.filter((p) => p !== tracked);
        });

        return tracked.promise;
    }, []);

    const isPending = useCallback(() => {
        return promisesRef.current.some((p) => p.isPending());
    }, []);

    const clear = useCallback(() => {
        promisesRef.current = [];
    }, []);

    return {
        addPromise,
        isPending,
        clear,
        promises: () => promisesRef.current,
    };
};

export default usePromises;
