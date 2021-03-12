import React, { useEffect, useState } from "react";
import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth"; //user authentication
import "firebase/database"; //database setup
import { useAuthState } from "react-firebase-hooks/auth"; //needed to authorize the user
import { useCollectionData } from "react-firebase-hooks/firestore";
import { isWhiteSpaceLike } from "typescript";

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

      <section>{user ? <MatchRoom auth={auth} /> : <SignIn user={user} />}</section>
    </div>
  );
}

function SignIn(props:any) {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(async ()=>{

      // if(props.user != null)
      // {
        const playerRef = firestore.collection("Player");

        await playerRef.add({
          name: auth.currentUser?.displayName,
          photo: auth.currentUser?.photoURL,
          move: 0,
          health: 10,
          timeLogged: firebase.firestore.FieldValue.serverTimestamp()
        })
        .catch((error)=>{
            alert(error);
        });
      // }
    });
    
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

  const logOut = async () => {

    //remove player from list before logging them out
    const playerRef = firestore.collection("Player");
    const data = await playerRef.get();
    
    let idVal = "";
    if (data != undefined)
    {
      data.docs.forEach(item=>{
        if(item.data().name == auth.currentUser?.displayName)
        {
          idVal = item.id;
        }
      })

      if(idVal !== "")
      {
        playerRef.doc(idVal).delete();
      }
      
      auth.signOut();
    }
  }

  return (
    auth.currentUser && (
      <button className="sign-out" onClick={logOut}>
        Sign Out
      </button>
    )
  );
}

function MatchRoom(props: any) {

  const playerRef = firestore.collection("Player").orderBy("timeLogged");

  const [players] = useCollectionData(playerRef,{idField: "id"});

  useEffect(() => {
    
    console.log(players?.length);
    console.log(players);
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
    <div className="container">
      {/* TO DO MAKE MATCH ROOM COME HERE IF USER IS SIGNED IN */}
      <h1 style={{color:"white", margin:40}}>Match Room</h1>

      <div className="row justify-content-center">
        {players != undefined ?
        
          players.map((e,i)=>{
            if(i%2 == 0)
            {
              return(<Player1 key={e.id} player={e} />) //apparently I really need this return here
              
            }
            else
            {
              return(<Player2 key={e.id} player={e} />)
            }
              
          })
        :
          <p style={{color:"white"}}>ERROR: Cannot receive player data right now.</p>
        }
      </div>
    </div>
  );
}

const Player1 = (props:any) => {
  return (
    <div className="col-6">
        <div className="p1-health" style={{ color: "white" }}>
          <p>{props.player.health}</p>
        </div>

        <h4 style={{ color: "white"}}>
          {props.player.name}
        </h4>

        <div className="p1-move">
          <img src={props.player.photo} alt="player 1" />
          <p style={{ color: "white" }}>{props.player.move}</p>
        </div>

        <button onClick={() => ""}>Swing Kick</button>
        <button onClick={() => ""}>Uppercut</button>
        <button onClick={() => ""}>Low Kick</button>
    </div>
  )
}

const Player2 = (props:any) => {
  return (
    <div className="col-6">
        <div  style={{ color: "white" }}>
          <p>{props.player.health}</p>
        </div>

        <h4  style={{ color: "white"}}>
          {props.player.name}
        </h4>

        <div className="p1-move">
          <img src={props.player.photo} alt="player 2" />
          <p style={{ color: "white" }}>{props.player.move}</p>
        </div>

        <button onClick={() => ""}>Swing Kick</button>
        <button onClick={() => ""}>Uppercut</button>
        <button onClick={() => ""}>Low Kick</button>
    </div>
  )
}

export default App;
