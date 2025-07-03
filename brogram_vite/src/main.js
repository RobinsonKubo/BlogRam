import './blogram.css'
import './font_style.css'
import './form.css'
import './blogram.js'
import './firebase/app.js'

import { auth, provider } from "./firebase/auth";
import { db } from "./firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp, onSnapshot, orderBy, query } from "firebase/firestore";

const loginBtn = document.getElementById("googleLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const commentForm = document.getElementById("comment-form");
const commentInput = document.getElementById("comment");
const commentList = document.getElementById("comment-list");

let currentUser = null;

// ログイン状態監視
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    commentForm.style.display = "block";
  } else {
    currentUser = null;
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    commentForm.style.display = "none";
  }
});

// ログイン
loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider).catch(console.error);
});

// ログアウト
logoutBtn.addEventListener("click", () => {
  signOut(auth).catch(console.error);
});

// コメント投稿
commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = commentInput.value.trim();
  if (!text || !currentUser) return;
  await addDoc(collection(db, "comments"), {
    uid: currentUser.uid,
    name: currentUser.displayName,
    comment: text,
    createdAt: serverTimestamp()
  });
  commentInput.value = "";
});

// コメント一覧取得（リアルタイム）
const q = query(collection(db, "comments"), orderBy("createdAt", "desc"));
onSnapshot(q, (snapshot) => {
  commentList.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    const item = document.createElement("li");
    item.textContent = `${data.name || "匿名"}：${data.comment}`;
    commentList.appendChild(item);
  });
});

