import firebase from 'firebase/app'
import 'firebase'

const firebaseConfig = {
  apiKey: "***********************",
  authDomain: "*******************",
  databaseURL: "******************",
  projectId: "********************",
  storageBucket: "****************",
  messagingSenderId: "************",
  appId: "************************",
  measurementId: "****************"
}
firebase.initializeApp(firebaseConfig)

const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()
const posts = db.collection('posts')
const users = db.collection('users')

export {
  db,
  auth,
  storage,
  posts,
  users
}
