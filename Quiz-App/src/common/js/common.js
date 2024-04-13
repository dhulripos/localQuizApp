// 右クリックを無効化する関数
function disableRightClick(event) {
  event.preventDefault(); // デフォルトの右クリックの動作をキャンセル
}
// ページが読み込まれたときに右クリックを無効化する
window.onload = function () {
  document.addEventListener("contextmenu", disableRightClick); // document全体に対して右クリックイベントを無効化する
};

// F12キーのキーコード
const F12_KEYCODE = 123;
// キーボードイベントを処理する関数
function handleKeyPress(event) {
  // 押されたキーのキーコードがF12キーと一致するかを確認
  if (event.keyCode === F12_KEYCODE) {
    event.preventDefault(); // デフォルトの動作をキャンセル
    return false; // イベントの伝播を停止
  }
}

// ctrl+shift+Iでディベロッパーツールを起動するのを無効化する
window.oncontextmenu = function () {
  return false;
};
document.addEventListener(
  "keydown",
  function (event) {
    var key = event.key || event.keyCode;

    if (key == 123) {
      return false;
    } else if (
      (event.ctrlKey && event.shiftKey && key == 73) ||
      (event.ctrlKey && event.shiftKey && key == 74)
    ) {
      return false;
    }
  },
  false
);
