const useDelay = ( callback = () => null, delay = 1000, cleanUpCallback = () => null ) => {
    const delayDebounceFn = setTimeout(() => callback(), delay)
    return () => {
        clearTimeout(delayDebounceFn)
        cleanUpCallback()
    }
}
export default useDelay;