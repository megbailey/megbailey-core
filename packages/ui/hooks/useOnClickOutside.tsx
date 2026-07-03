import { useEffect, useRef } from "react";

/**
 * Utility to callback when there has been click outside of the ref
 * and it is no longer in focus.
 */
function useOnClickOutside( ref: React.RefObject<HTMLElement | null>, callback: Function ) {
    const callbackRef = useRef( callback );

    useEffect(() => {
        callbackRef.current = callback;
    }, [ callback ]);

    useEffect(() => {
        const handleClickOutside = ( event: MouseEvent ) => {
            if ( ref.current && !ref.current.contains( event.target as Node )) {
                callbackRef.current();
            }
        };

        document.addEventListener( "mousedown", handleClickOutside );

        return () => document.removeEventListener( "mousedown", handleClickOutside );

    }, [ref]);
}

export default useOnClickOutside;