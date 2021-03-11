import React, { useEffect, useState } from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth"; //user authentication
import "firebase/database"; //database setup
import { useAuthState } from "react-firebase-hooks/auth"; //needed to authorize the user
import { useCollectionData } from "react-firebase-hooks/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEWJ1Yq1iDPQWSIO45Diz6kjxoR8oL-8Q",
  authDomain: "revature-fighters-r.firebaseapp.com",
  databaseURL: "https://revature-fighters-r-default-rtdb.firebaseio.com/",
  projectId: "revature-fighters-r",
  storageBucket: "revature-fighters-r.appspot.com",
  messagingSenderId: "266938737115",
  appId: "1:266938737115:web:50cec31645013c397807fe",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1></h1>
        <SignOut />
      </header>

      <section>{user ? <MatchRoom auth={auth} /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

function MatchRoom(props: any) {
  //get the fight actions
  // const matchRef = firestore.collection();

  let uid: any;
  let photoURL: any;
  if (auth.currentUser != null) {
    uid = auth.currentUser.uid;
    photoURL = auth.currentUser.photoURL;
  }

  const [matchState, setMatchState] = useState({
    p1health: 0,
    p1name: "",
    p1move: 0,
    p2health: 0,
    p2name: "",
    p2move: 0,
  });
  const [isPlayer1, setPlayer1] = useState(false);
  const [player1Attack, setPlayer1Attack] = useState("");

  const getData = async () => {
    const collectionRef = firestore.collection("Match");
    const data = await collectionRef.get();

    if (data != undefined) {
      data.docs.forEach((item) => {
        setMatchState({
          //not sure if the property names actually match the same values in the database
          p1health: item.data().p1Health,
          p1name: item.data().player1,
          p1move: item.data().p1Move,
          p2health: item.data().p2Health,
          p2name: item.data().player2,
          p2move: item.data().p1Move,
        });
      });
    }
  };

  useEffect(() => {
    getData();

    console.log(matchState.p1health);

    if (matchState.p1name === "" && matchState.p2name === "") {
      setPlayer1(true);

      const collectionRef = firestore.collection("Match");
      collectionRef.doc().update({
        player1move: uid,
      });
    }

    if(player1Attack !== "")
    {
      p1choice(player1Attack);
    }
  });

  const p1choice = async (choice: string) => {
    
    console.log(choice);
    const collectionRef = firestore.collection("Match");
    const data = await collectionRef.get();

    if (choice === "swing") {
      if (data != null) {
        collectionRef.doc().update({
          player1move: 1,
        });
        if (matchState.p2move !== 0) {
          if (matchState.p2move === 1) {
            //if the 2nd player swing kicks
            //update the database so that both players are swing kicking
            collectionRef.doc().update({
              player1move: 1,
              player2move: 1,
            });

            setPlayer1Attack("");
          } else if (matchState.p2move === 2) {
            //if the 2nd player uppercut punches
            let obj = {
              p1health: 0,
              p2health: 0,
            };
            data.docs.forEach((item) => {
              obj = {
                p1health: item.data().player1health,
                p2health: item.data().player2health,
              };
            });

            //update the database
            collectionRef.doc().update({
              player1health: obj.p1health - 2,
              player2health: obj.p1health,
              player1move: 1,
              player2move: 2,
            });

            setPlayer1Attack("");
          } else if (matchState.p2move === 3) {
            //if the 2nd player uppercut punches
            let obj = {
              p1health: 0,
              p2health: 0,
            };
            data.docs.forEach((item) => {
              obj = {
                p1health: item.data().player1health,
                p2health: item.data().player2health,
              };
            });

            //update the database
            collectionRef.doc().update({
              player1health: obj.p1health - 2,
              player2health: obj.p1health,
              player1move: 1,
              player2move: 3,
            });

            setPlayer1Attack("");
          }
        }
      }
    } 
  };

  return (
    <>
      {/* TO DO MAKE MATCH ROOM COME HERE IF USER IS SIGNED IN */}
      <h1>Match Room</h1>

      {isPlayer1 ? (
        <>
          <div className="p1-health" style={{ color: "white" }}>
            {matchState.p1health}
          </div>
          <div className="p1-name" style={{ color: "white" }}>
            {matchState.p1name}
          </div>
          <div className="p1-move">
            <img src={photoURL} alt="player 1" />
            <p style={{ color: "white" }}>{matchState.p1move}</p>
          </div>
          <button onClick={() => setPlayer1Attack("swing")}>Swing Kick</button>
          <button onClick={() => p1choice("upper")}>Uppercut</button>
          <button onClick={() => p1choice("low")}>Low Kick</button>
        </>
      ) : (
        <div className="p1"></div>
      )}
    </>
  );
}

export default App;