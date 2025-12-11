import { useState } from "react";
import AuthContent from "../components/Auth/AuthContent";
import { login } from "../APIs/firebase";
import LoadingOverlay from "../components/ui/LoadingOverlay";

function LoginScreen() {

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    await login(email, password);
    setIsAuthenticating(false);
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging in..." />;
  }


  return <AuthContent isLogin = {true} onAuthenticate={loginHandler}/>;
}

export default LoginScreen;
