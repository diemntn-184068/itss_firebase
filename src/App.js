import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import React, { useEffect, useState } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import Todo from './components/Todo';
import Upload from './components/Upload'
import './styles/main.css';
import { saveUserInformation, updateUserInformation } from './lib/firebase'
/* スタイルシート */

const firebaseConfig = {
  apiKey: "AIzaSyCTlGtPL7JEfC48MwR4uq_XJuD80g7ssNo",
  authDomain: "fir-sample-eb1e3.firebaseapp.com",
  databaseURL: "https://fir-sample-eb1e3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fir-sample-eb1e3",
  storageBucket: "fir-sample-eb1e3.appspot.com",
  messagingSenderId: "389871433838",
  appId: "1:389871433838:web:3b4a3023fc2970bd3c4e7f"
};

firebase.initializeApp(firebaseConfig)

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

/* コンポーネント */

function App() {

  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const [userAfterLogin, setUserAfterLogin] = useState(null)

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const dataUserAfterLogin = await saveUserInformation(user)
        setUserAfterLogin(dataUserAfterLogin)
        setIsSignedIn(!!dataUserAfterLogin);
      }
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  const handleImageChanged = async imgUrl => {
    await updateUserInformation(userAfterLogin, imgUrl);
  }


  if (!isSignedIn) {
    return (
      <div>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </div>
    );
  }

  return (
    <div className="container is-fluid">

      <p>{firebase.auth().currentUser.displayName}</p>
      <div class="navbar-item">
        <Upload userImage={userAfterLogin.image} onSelectedImage={handleImageChanged} userAfterLogin={userAfterLogin} />
        {userAfterLogin.name}
      </div>

      <a onClick={() => {
        firebase.auth().signOut()
        setIsSignedIn(false)
      }}>Logout</a>
      <Todo />
    </div>
  );
}

export default App;
