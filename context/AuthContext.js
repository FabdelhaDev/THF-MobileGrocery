import React from "react";
import createDataContext from "./createDataContext";

// Define the reducer function to manage authentication state
const authReducer = (state, action) => {
    switch (action.type) {
        case 'authenticate':
            return { token: action.payload.token, isAuthenticated: !!action.payload.token };  // !! converts token to boolean and ensures isAuthenticated is true if token is non-empty
        case 'logout':
            return { token: action.payload.token, isAuthenticated: !!action.payload.token };  // !! converts token to boolean and ensures isAuthenticated is false if token is null or empty
        default:
            return state;
    }
};

// D
const authenticate = (dispatch) => {
    return (token, callback) => {
        dispatch({ type: 'authenticate', payload: {token : token}});
        callback();
    }
};

const logout = (dispatch) => {
    return (callback) => {
        dispatch({ type: 'logout', payload: {token: null}}); // Could also use "" instead of null
        callback();
    };
};

export const { Context: AuthContext, Provider: AuthProvider } = createDataContext(
    authReducer,
    {authenticate: authenticate, logout: logout},
    { token: "", isAuthenticated: false }
);

