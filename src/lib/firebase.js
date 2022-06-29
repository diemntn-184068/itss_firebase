import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCTlGtPL7JEfC48MwR4uq_XJuD80g7ssNo",
    authDomain: "fir-sample-eb1e3.firebaseapp.com",
    databaseURL: "https://fir-sample-eb1e3-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fir-sample-eb1e3",
    storageBucket: "fir-sample-eb1e3.appspot.com",
    messagingSenderId: "389871433838",
    appId: "1:389871433838:web:3b4a3023fc2970bd3c4e7f"
  };
const app = firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()

export const getAllDataInCollection = async () => {
    const testData = (await db.collection("todos").get()).docs.map(e => {
        const { text, done } = e.data()
        return {
            key: e.id,
            text, done
        }
    })
    return testData
}

export const addNewDataInCollection = async (data, collectionName = "todos") => {
    await db.collection(collectionName).add(data)
}

export const updateItemFirebase = async (data, collectioName = "todos") => {
    await db.collection(collectioName).doc(data.key).update(data)
}

export const deleteAllItemsFirebase = async (listIds) => {
    await Promise.all(listIds.map(async e => {
        await db.collection("todos").doc(e).delete()
    }))
}

export const saveUserInformation = async (user) => {
    const { uid } = user
    const dataUserAfterSigned = (await db.collection("users").doc(uid).get()).data()
    // ! case user have not in database, so we need save this user to database
    if (!dataUserAfterSigned) {
        await db.collection("users").doc(uid).set({
            nameDisplay: user.displayName
        })
        return {
            nameDisplay: user.displayName,
            id: uid
        }
    } else {
        return {
            ...dataUserAfterSigned, id: uid
        }
    }
}

export const updateUserInformation = async (user, img) => {
    try {
        const userDoc = await db.collection("users").doc(user.id).get();
        if (userDoc.exists) {
            await db.collection("users").doc(user.id).update({ ...userDoc.data(), image: img });
        }
    } catch (err) {
        console.log("🚀 ~ file: firebase.js ~ line 66 ~ updateUserInformation ~ err", err)
    }
}

export const uploadImage = async (image, userAfterLogin) => {
    console.log("🚀 ~ file: firebase.js ~ line 75 ~ uploadImage ~ userAfterLogin", userAfterLogin)
    // Create a root reference
    const storage = getStorage(app);
    // Create a reference to 'mountains.jpg'
    const mountainsRef = ref(storage, `images/${image.name}`);
    await uploadBytesResumable(mountainsRef, image)
    const imageUrl = await getDownloadURL(mountainsRef)
    return imageUrl
};