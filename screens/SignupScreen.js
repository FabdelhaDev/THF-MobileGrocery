import { useState } from "react";

import AuthenticationContent from "../components/Auth/AuthContent";
import { createUser } from "../APIs/firebase";
import LoadingOverlay from "../components/ui/LoadingOverlay";

function SignupScreen() {

  const [isAuthenticating, setIsAuthenticating] = useState(false);

  async function signupHandler({ email, password }) {
    setIsAuthenticating(true);
    await createUser(email, password);
    setIsAuthenticating(false);
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return <AuthenticationContent isLogin={false} onAuthenticate={signupHandler} />;
}

export default SignupScreen;
