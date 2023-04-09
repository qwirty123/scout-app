import React from "react";

export function useForceUpdate() {
    // https://stackoverflow.com/a/53837442
    const [value, setValue] = React.useState(0);
    return () => setValue(value => value + 1);
}


export function useCombineCallbacks(num, callback) {
    /** I wrote this to run a callback when multiple callbacks finish runnning */
    let timesRun = 0
    return () => {
        timesRun += 1
        if (timesRun == num) {
            callback()
        } else if (timesRun >= num) {
            console.error("More times run then expected")
        }
    }
}