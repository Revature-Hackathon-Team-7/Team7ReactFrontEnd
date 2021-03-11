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

  const [players, setPlayers] = useState([{}]);

  // const [isPlayer1, setPlayer1] = useState(false);
  // const [player1Attack, setPlayer1Attack] = useState("");

  const getData = async () => {
    const collectionRef = firestore.collection("Player");
    const data = await collectionRef.get();

    if (data != undefined) {
      //console.log(data);
      
      data.docs.forEach((item) => 
      {
        let temp = {}.push({
          name: item.data().name,
          move: item.data().move,
          health: item.data().health,
          photo: photoURL,
        });

        setPlayers(temp));
      });
    }
  };

  useEffect(() => {
    getData();
  });

  // const p1choice = async (choice: string) => {
    
  //   console.log(choice);
  //   const collectionRef = firestore.collection("Match");
  //   const data = await collectionRef.get();

  //   if (choice === "swing") {
  //     setPlayer1Attack("");
  //     if (data != null) {
  //       collectionRef.doc().update({
  //         player1move: 1,
  //       });
  //       if (matchState.p2move !== 0) {
  //         if (matchState.p2move === 1) {
  //           //if the 2nd player swing kicks
  //           //update the database so that both players are swing kicking
  //           collectionRef.doc().update({
  //             player1move: 1,
  //             player2move: 1,
  //           });
            
  //         } else if (matchState.p2move === 2) {
  //           //if the 2nd player uppercut punches
  //           let obj = {
  //             p1health: 0,
  //             p2health: 0,
  //           };
  //           data.docs.forEach((item) => {
  //             obj = {
  //               p1health: item.data().player1health,
  //               p2health: item.data().player2health,
  //             };
  //           });

  //           //update the database
  //           collectionRef.doc().update({
  //             player1health: obj.p1health - 2,
  //             player2health: obj.p1health,
  //             player1move: 1,
  //             player2move: 2,
  //           });
  //         } else if (matchState.p2move === 3) {
  //           //if the 2nd player uppercut punches
  //           let obj = {
  //             p1health: 0,
  //             p2health: 0,
  //           };
  //           data.docs.forEach((item) => {
  //             obj = {
  //               p1health: item.data().player1health,
  //               p2health: item.data().player2health,
  //             };
  //           });

  //           //update the database
  //           collectionRef.doc().update({
  //             player1health: obj.p1health - 2,
  //             player2health: obj.p1health,
  //             player1move: 1,
  //             player2move: 3,
  //           });

  //         }
  //       }
  //     }
  //   } 
  // };

  return (
    <>
      {/* TO DO MAKE MATCH ROOM COME HERE IF USER IS SIGNED IN */}
      <h1>Match Room</h1>

      {players.map((e,i)=>{
          // <Player key={i} health={e.health} photo={e.photo} name={e.name}
          // move={e.move} />
      })}
    </>
  );
}

const Player = (props:any) => {
  return (
    <>
          <div className="p1-health" style={{ color: "white" }}>
            {props.health}
          </div>
          <div className="p1-name" style={{ color: "white" }}>
            {props.name}
          </div>
          <div className="p1-move">
            <img src={props.photo} alt="player 1" />
            <p style={{ color: "white" }}>{props.move}</p>
          </div>
          <button onClick={() => ""}>Swing Kick</button>
          <button onClick={() => ""}>Uppercut</button>
          <button onClick={() => ""}>Low Kick</button>
        </>
  )
}

export default App;