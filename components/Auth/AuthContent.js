import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert, StyleSheet, View } from 'react-native';

import FlatButton from '../ui/FlatButton';
import AuthForm from './AuthForm';
import { Colors } from '../../constants/styles';

function AuthContent({ isLogin, onAuthenticate }) {

 const navigation = useNavigation(); 

  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
  });

  /*
  * The below function switchAuthModeHandler is valid, yes both login and signup are screens that are usually listed in App.js
  * as a Stack.screen but it offloads all of its creation content to this reusable component (AuthContent.js).
  * So the navigation prop is not directly available here unless we pass it down from the parent screen.
  * For simplicity, we can handle the navigation in the parent screens (LoginScreen and SignupScreen)
  * and remove this function from here.  Or we can use the useNavigation hook from react-navigation to access 
  * the navigation prop indirectly which is what we will do here. (previously we tried to pass props.navigation
  * down from the parent screen but that led to errors). Now we can use navigation.navigate() below.  This still
  * gives us a back arrow to return to the previous screen.  To change that behavior, we would need to adjust
  * we will use navigation.replace() instead of navigate() to prevent going back.
  *
  */  
  
  function switchAuthModeHandler() {
    if (isLogin) {
      // We are currently in Login mode, switch to Signup mode
      // This would typically involve navigation to a Signup screen
      navigation.replace('Signup');
    }
    else {
      // We are currently in Signup mode, switch to Login mode
      // This would typically involve navigation to a Login screen
      navigation.replace('Login');
    }
  }

  function submitHandler(credentials) {
    let { email, confirmEmail, password, confirmPassword } = credentials;

    email = email.trim();
    password = password.trim();

    const emailIsValid = email.includes('@');
    const passwordIsValid = password.length > 16;   // Changed from 6 to 16 for stronger passwords per NIST guidelines 8 is minimum max is 64
    const emailsAreEqual = email === confirmEmail;
    const passwordsAreEqual = password === confirmPassword;

    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!emailsAreEqual || !passwordsAreEqual))
    ) {
      Alert.alert('Invalid input', 'Please check your entered credentials.');
      setCredentialsInvalid({
        email: !emailIsValid,
        confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
      });
      return;
    }
    onAuthenticate({ email, password });
  }

  return (
    <View style={styles.authContent}>
      <AuthForm
        isLogin={isLogin}
        onSubmit={submitHandler}
        credentialsInvalid={credentialsInvalid}
      />
      <View style={styles.buttons}>
        <FlatButton onPress={switchAuthModeHandler}>
          {isLogin ? 'Create a new user' : 'Log in instead'}
        </FlatButton>
      </View>
    </View>
  );
}

export default AuthContent;

const styles = StyleSheet.create({
  authContent: {
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary800,
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
  },
  buttons: {
    marginTop: 8,
  },
});