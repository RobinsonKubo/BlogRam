if (window.confirm('GoodManBusters！')) {
    console.log('ゲームを開始します。');
} else {
    console.log('ゲーム終了します。');
}

let answer;
while (true) {
    answer = window.prompt('ヘルプを見ますか？');
    if (answer === null) {
        window.alert('キャンセルされました。');
        break;
    }
    const normalized = answer.trim().toLowerCase();
    if (normalized === 'yes') {
        window.alert('GoodManをなるべく早く倒そう！');
    } else if (normalized === 'no') {
        window.alert('ゲームスタート！！');
        break;
    } else {
        window.alert('yesかnoでお答えください。');
    }
}

window.alert('GoodManが現れた！！');
// 12ラウンド以内にGoodManを倒す。
const attacks = [
    { attack_name: '右ストレート', attack_sum: 10 },
    { attack_name: '左フック', attack_sum: 5 },
    { attack_name: 'アッパー', attack_sum: 50 }
]

let enemy_life = 200;
let downMessageShown = false;
let count = 0;

while (enemy_life > 0) {
    const randomAttack = attacks[Math.floor(Math.random() * attacks.length)];
    console.log(`${randomAttack.attack_name}!!`);
    enemy_life -= randomAttack.attack_sum;
    count += 1;
    if (enemy_life <= 100 && !downMessageShown) {
        console.log('おおっと、今のはダウンか！？　いや、ダウンではない！！');
        downMessageShown = true;
    }
}
console.log('チャ、チャンピオンがダウン！！');
console.log(count + 'ラウンドでGoodManを倒した！');