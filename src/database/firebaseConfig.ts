import dotenv from "dotenv";

dotenv.config();

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "open-banking-fa2ae.firebaseapp.com",
  projectId: "open-banking-fa2ae",
  storageBucket: "open-banking-fa2ae.appspot.com",
  messagingSenderId: "831398661700",
  appId: "1:831398661700:web:0d76b8c78b612e869f7611",
};
