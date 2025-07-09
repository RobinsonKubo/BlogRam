import './blogram.css';
import './font_style.css';
import './form.css';
import './blogram.js';
import './firebase/app.js';

import { auth, provider } from "./firebase/auth";
import { db, getLatestComments } from "./firebase/firestore";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const loginBtn = document.getElementById("googleLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const commentSubmitBtn = document.getElementById("commentSubmit"); // IDを修正
const commentInput = document.getElementById("commentArea");      // IDを修正
const commentsContainer = document.getElementById("comments-container");
const loginBtnComment = document.getElementById("googleLoginBtnComment");
const overlayMessage = document.getElementById("overlayMessage"); // オーバーレイを取得

let currentUser = null;

// ログイン状態監視
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    overlayMessage.style.display = "none"; // ログイン時はオーバーレイを非表示
    commentInput.disabled = false; // テキストエリアを有効化
    commentSubmitBtn.disabled = false; // 送信ボタンを有効化
  } else {
    currentUser = null;
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    overlayMessage.style.display = "flex"; // 未ログイン時はオーバーレイを表示
    commentInput.disabled = true; // テキストエリアを無効化
    commentSubmitBtn.disabled = true; // 送信ボタンを無効化
  }
});

// ログイン
loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider).catch(console.error);
});

// ログイン (コメント欄のボタン)
loginBtnComment.addEventListener("click", () => {
  signInWithPopup(auth, provider).catch(console.error);
});

// ログアウト
logoutBtn.addEventListener("click", () => {
  signOut(auth).catch(console.error);
});

// コメント投稿 (クリックイベントに変更)
commentSubmitBtn.addEventListener("click", async () => {
  const text = commentInput.value.trim();
  if (!text || !currentUser) return;
  
  try {
    await addDoc(collection(db, "comments"), {
      uid: currentUser.uid,
      name: currentUser.displayName,
      comment: text,
      timestamp: serverTimestamp()
    });
    commentInput.value = "";
    displayLatestComments(); // 投稿後にリストを更新
  } catch (error) {
    console.error("コメントの投稿中にエラーが発生しました:", error);
  }
});

/**
 * 最新のコメント5件を取得して表示する
 */
async function displayLatestComments() {
    if (!commentsContainer) return; // 要素がなければ何もしない
    const comments = await getLatestComments();
    commentsContainer.innerHTML = ""; // コンテナをクリア

    comments.forEach(comment => {
        const li = document.createElement("li");
        li.classList.add("comment-item");

        const commentDate = comment.timestamp ? comment.timestamp.toDate().toLocaleString('ja-JP') : '日付不明';

        li.innerHTML = `
            <div class="comment-meta">
                <span class="comment-author">${comment.name || '匿名'}</span>
                <span class="comment-date">${commentDate}</span>
            </div>
            <p class="comment-text">${comment.comment}</p>
        `;
        commentsContainer.appendChild(li);
    });
}

// ページ読み込み時に初回表示
document.addEventListener('DOMContentLoaded', displayLatestComments);



