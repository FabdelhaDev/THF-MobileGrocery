import axios from "axios";

//import { FIREBASE_API_KEY } from "@env";

const FIREBASE_API_KEY = ""; // Replace with your actual API key

async function authenticate(mode, email, password) {
  const url = "https://identitytoolkit.googleapis.com/v1/accounts:" + mode + "?key=" + FIREBASE_API_KEY;

    try {
    const response = await axios.post(
      url,
      { 
        email: email,
        password: password,
        returnSecureToken: true 
        }
    )
    console.log(response.data);
}
    catch (error) {
        console.log("Error during authentication:");
        console.log(error);
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.config);
    }
}

export async function createUser(email, password) {
  await authenticate("signUp", email, password);
}

export async function login(email, password) {
  await authenticate("signInWithPassword", email, password);
}



