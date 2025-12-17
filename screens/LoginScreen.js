import { useState, useContext } from "react"; // added to use the useContext hook
import AuthContent from "../components/Auth/AuthContent"; //added to use the AuthContent component
import { login } from "../APIs/firebase";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Alert } from "react-native";
import { AuthContext } from "../context/AuthContext"; // added to use the authenticate function



function LoginScreen() {

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const authCtx = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const user =await login(email, password); // changed from await login(email, password) to const user = await login(email, password) to get the user object
      const token = await user.getIdToken(); // added to get the token from the user object
      authCtx.authenticate(token); // added token to the authenticate function
    } catch (error) {
      Alert.alert(
        "Authentication failed!",
        error.message || "Could not log you in. Please check your credentials or try again later!");
    } finally {
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating === true) {
    return <LoadingOverlay message="Logging in..." />;
  }

  return <AuthContent isLogin = {true} onAuthenticate={loginHandler}/>;
}

export default LoginScreen;
