import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';

import firebase from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth'; //user authentication
import "firebase/database"; //database setup
import { useAuthState } from "react-firebase-hooks/auth"; //needed to authorize the user
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBEWJ1Yq1iDPQWSIO45Diz6kjxoR8oL-8Q",
    authDomain: "revature-fighters-r.firebaseapp.com",
    databaseURL: "https://revature-fighters-r-default-rtdb.firebaseio.com/",
    projectId: "revature-fighters-r",
    storageBucket: "revature-fighters-r.appspot.com",
    messagingSenderId: "266938737115",
    appId: "1:266938737115:web:50cec31645013c397807fe"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      {/* {user != null ?
      <></>
      // <Match />
      :
      <></>
      // <SignIn />
      } */}
      <header>
        <h1></h1>
        <SignOut />

      </header>

      <section>
        {user ? <MatchRoom /> : <SignIn />}
      </section>
    </div>
  );
}

function SignIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  
  return(
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
    </>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function MatchRoom() {
  //get the fight actions
  // const matchRef = firestore.collection();

  const [matchState, setMatchState] = useState({
    p1health: 0,
    p1name: "",
    p1move: 0,
    p2health: 0,
    p2name: "",
    p2move: 0,
  });

  const getData = async () => {

    const collectionRef = firestore.collection("Match");
    const data = await collectionRef.get();

    if (data != undefined)
    {
      data.docs.forEach(item=>{
          setMatchState({
            //not sure if the property names actually match the same values in the database
            p1health: item.data().player1health,
            p1name: item.data().player1name,
            p1move: item.data().player1move,
            p2health: item.data().player2health,
            p2name: item.data().player2name,
            p2move: item.data().player1move,
          })
      });
    }
  }

  useEffect(()=>{
    getData();

    if(matchState.p1name === "")
    {
      
    }
  })
  
  return (
    <>
      {/* TO DO MAKE MATCH ROOM COME HERE IF USER IS SIGNED IN */}
      <h1>Match Room</h1>
      
    </>
  )
}

export default App;
