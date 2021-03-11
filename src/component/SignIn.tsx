import react, { SyntheticEvent, useState } from "react";
import firebase from "firebase";

export default function SignIn(){
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    
    firebase.auth().signInAnonymously()
    .then(() => {
      // Signed in..
    })
    .catch((error) => {
      let errorCode = error.code;
      let errorMessage = error.message;
      // ...
    });
    
    const handleSubmit = (e: SyntheticEvent) => {
        e.preventDefault()
    }

    return(
        <form>
            <label htmlFor="username">Username:</label>
            <input id="username" name="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <label htmlFor="password">Password:</label>
            <input id="password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" onClick={(e) => handleSubmit(e)}>Enter</button>
        </form>
    );
}