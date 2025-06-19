// 問い合わせフォーム
function openForm() {
    document.getElementById('formPopup').style.display = "block";
    document.body.classList.add('no-scroll');
}

function closeForm() {
    document.getElementById('formPopup').style.display = "none";
    document.body.classList.remove('no-scroll');
}