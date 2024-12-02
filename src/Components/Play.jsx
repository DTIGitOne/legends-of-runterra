import { createContext, useContext, useState } from "react";

const Context = createContext(); // context instance

export const PlayProvider = ({ children }) => {
    const [play, setPlay] = useState(false); // state for starting the scroll through site
    const [end, setEnd] = useState(false); // state for the ending of the site
    const [ hasScroll, setHasScroll] = useState(false); // detecting if the site is scrollable

    return (
        <Context.Provider
            value={{
                play,
                setPlay,
                end,
                setEnd,
                hasScroll,
                setHasScroll
            }}
        >
            {children}
        </Context.Provider>
    );
}

// context hook
export const usePlay = () => {
    const context = useContext(Context);

    if(context === undefined) {
        throw new Error("error")
    }

    return context;
}