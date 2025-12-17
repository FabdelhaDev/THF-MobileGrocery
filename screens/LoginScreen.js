import { useState } from "react";
import AuthContent from "../components/Auth/AuthContent";
import { login } from "../APIs/firebase";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Alert } from "react-native";


function LoginScreen() {

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      await login(email, password);
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
