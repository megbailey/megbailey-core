import { useEffect, useRef } from "react";

const useAbortController = () => {
    const controllerRef = useRef<AbortController | null>(null);

    const getController = () => {
        if (!controllerRef.current) {
            controllerRef.current = new AbortController();
        }
        return controllerRef.current;
    };

    useEffect(() => {
        return () => {
            if (controllerRef.current) {
                controllerRef.current.abort();
            }
        };
    }, []);

    return { getController };
};

export default useAbortController;
