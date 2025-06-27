// 問い合わせフォーム-----------------------------------------------------------
function openForm() {
    document.getElementById('formPopup').style.display = "flex";
    document.body.classList.add('no-scroll');
}

function closeForm() {
    document.getElementById('formPopup').style.display = "none";
    document.body.classList.remove('no-scroll');
}


// メニュ toc-menu ----------------------------------------------------------
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

// 開いた後に max-height を固定解除（中身増減への対応）
toc.addEventListener('transitionend', () => {
if (isOpen) {
    toc.style.maxHeight = 'none';
}
});
