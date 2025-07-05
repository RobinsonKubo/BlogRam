import ScrollReveal from "scrollreveal";

import app from "./firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
const auth = getAuth(app);

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase/app.js";

document.addEventListener('DOMContentLoaded', () => { // DOMの読み込みが完了してから実行される処理　※大事
    
    // Webサイト表示時のアニメーション（ScrollRevealの設定）--------------------------------------
    const revealCommon = {
        duration: 1500, // アニメーションの時間（ミリ秒）
        distance: '30px',  // 上方向に50px移動しながら表示
        opacity: 0,        // 初期の透明度
        easing: 'ease-in-out', // 自然な加速・減速の動き
        reset: false,     // スクロールで何度もアニメーションさせたい場合はtrue
    };
    // 適用対象と個別設定の配列
    const revealTargets = [
        { selector: '.fade-in-up', options: { origin: 'left', delay: 0 } }, // origin 左から右へ
        { selector: '.fade-in-up2', options: { origin: 'right', delay: 500 } }, // delay 開始までの遅延（ミリ秒）
        { selector: '.fade-profile', options: { origin: 'bottom', delay: 0 } },
        // { selector: '.main-grid', options: { duration: 1500, origin: 'bottom', delay: 0 } }　// スマホ表示時若干ラグの可能性
    ];
    // ループで一括適用
    revealTargets.forEach(({ selector, options }) => {
        ScrollReveal().reveal(selector, { ...revealCommon, ...options });
    });


    // 問い合わせフォーム　開閉-----------------------------------------------------------
    document.getElementById('openFormBtn').addEventListener('click', openForm);
    document.getElementById('closeFormBtn').addEventListener('click', closeForm);

    function openForm() {
        document.getElementById('formPopup').style.display = "flex";
        document.body.classList.add('no-scroll');
    }

    function closeForm() {
        document.getElementById('formPopup').style.display = "none";
        document.body.classList.remove('no-scroll');
    }


    // メニュ toc-menu 開閉----------------------------------------------------------
    const toggleBtn = document.getElementById('toc-toggle');
    const toc = document.getElementById('toc-content');
    let isOpen = false;

    toggleBtn.addEventListener('click', () => {
        if (isOpen) {
            // 閉じる
            toc.style.maxHeight = toc.scrollHeight + 'px'; // 一度セットしないとtransition効かない
            requestAnimationFrame(() => {
                toc.style.maxHeight = '0';
                toc.classList.remove('open');
            });
            toggleBtn.innerHTML = '<i class="fa-solid fa-caret-down"></i>';
        } else {
            // 開く
            toc.classList.add('open');
            toc.style.maxHeight = toc.scrollHeight + 'px';
            toggleBtn.innerHTML = '<i class="fa-solid fa-caret-up margin-up"></i>';
        }
        isOpen = !isOpen;
    });
    // 開いた後に max-height を固定解除することで開閉時のラグへの対応（項目が増減した場合に有効）
    toc.addEventListener('transitionend', () => {
        if (isOpen) {
            toc.style.maxHeight = 'none';
        }
    });


    // コメントフォームの機能 メソッド-----------------------------------------------------------
    onAuthStateChanged(auth, (user) => { // auth は Firebase が提供するインスタンス
        const commentBox = document.getElementById('commentBox');
        const commentArea = document.getElementById('commentArea');
        const overlay = document.getElementById('overlayMessage');
        const submitBtn = document.getElementById('commentSubmit');

        commentBox.style.display = 'block';// JavaScriptでは、element.style で その要素のインラインCSSを操作できます。

        if (user) {
            commentArea.disabled = false;
            submitBtn.disabled = false;
            overlay.style.display = 'none';// disabled はユーザーに操作を許可しない 
            // =false は逆にそのフォームを“有効”にする（ユーザーが入力・操作できるようにする）
        } else {
            commentArea.disabled = true;
            submitBtn.disabled = true;
            overlay.style.display = 'flex';
        }
    });

    // Firestore にデータを追加
    //　JSは、時間のかかる処理（例えばFirebaseへの通信）は待たずに先に進んでしまう傾向があるので、
    async function postComment(text) { // 関数自体を async にしてから、await を使って完了を待つ。
        const user = auth.currentUser;// auth.currentUser は Firebase Authentication が公式に提供しているプロパティ
        if (!user) return;

        await addDoc(collection(db, "comments"), { // async 関数の中で使用する。
            text: text,
            uid: user.uid,
            displayName: user.displayName || "匿名",
            createdAt: serverTimestamp()
        });
    };


    const commentInput = document.getElementById('commentArea');
    const submitBtn = document.getElementById('commentSubmit');

    submitBtn.addEventListener('click', async () => {
    const text = commentInput.value.trim();
    if (!text) return;

    try { // try () はJSのブロック構文
        await addDoc(collection(db, "comments"), {
        text,
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName || "匿名",
        createdAt: serverTimestamp()
        });

        commentInput.value = ""; // 成功したら入力欄を空にする
        alert("コメントを投稿しました！");
    } catch (e) {
        console.error("投稿エラー:", e);
        alert("投稿に失敗しました");
    }
    });
        

});