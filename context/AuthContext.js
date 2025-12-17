import AsyncStorage from '@react-native-async-storage/async-storage';
import createDataContext from "./createDataContext";

// Define the reducer function to manage authentication state
const authReducer = (state, action) => {
    switch (action.type) {
        // Renamed 'authenticate' action type to 'signin' for clarity
        case 'signin':
            // The payload will contain the token if successful, or null/empty if not logged in
            return { ...state, token: action.payload.token, isAuthenticated: !!action.payload.token };
        case 'logout':
            return { ...state, token: null, isAuthenticated: false };
        case 'add_error':
            return { ...state, errorMessage: action.payload };
        default:
            return state;
    }
};

// Action creator to handle the sign-in process (saving token to storage)
const authenticate = (dispatch) => async (token, callback) => {
    try {
        // Save the token persistently
        await AsyncStorage.setItem('token', token);
        dispatch({ type: 'signin', payload: {token : token}});
        if (callback) {
            callback();
        }
    } catch (e) {
        dispatch({ type: 'add_error', payload: 'Failed to save token.' });
    }
};


// Action creator to attempt local login on app load
const tryLocalLogin = (dispatch) => async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
        // If a token is found in storage, dispatch signin action
        dispatch({ type: 'signin', payload: { token: token } });
    }
    // If no token is found, we do nothing and let App.js render the AuthStack
};


// Action creator to handle logout (removing token from storage)
const logout = (dispatch) => async (callback) => {
    try {
        await AsyncStorage.removeItem('token');
        dispatch({ type: 'logout' }); // No payload needed for logout
        if (callback) {
             callback();
        }
    } catch (e) {
        dispatch({ type: 'add_error', payload: 'Failed to log out.' });
    }
};

// Export the Context and Provider, including tryLocalLogin function in the actions object
export const { Context: AuthContext, Provider: AuthProvider } = createDataContext(
    authReducer,
    { authenticate, logout, tryLocalLogin }, 
    // Set initial state including potential error messages
    { token: null, isAuthenticated: false, errorMessage: '' } 
);
