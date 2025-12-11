import React, {useReducer} from "react";


export default (reducer, actions, defaultState) => {

    const Context = React.createContext();

    const Provider = ({children}) => {
        const [state, dispatch] = useReducer(reducer, defaultState);

        /* Goal: loop through all functions in actions object and bind them to dispatch
         * For each one, invoke it and pass in dispatch as an argument.
         * Take the inner closure function it returns and store it for later use.
         */
        const boundFunctions = {};

        //key will cycle through the name of each function stored in actions object
        for (let key in actions) {

            const closureFunction = actions[key](dispatch);
            boundFunctions[key] = closureFunction;
        }

        return <Context.Provider value={ {state : state, ...boundFunctions} }>
            {children}
        </Context.Provider>;
    }

    return {Context, Provider};
}


