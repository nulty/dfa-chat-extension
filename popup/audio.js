function audioNotification() {
  new Audio(
    chrome.runtime.getURL("sound/ready.mp3"),
  ).play();
}

chrome.storage.onChanged.addListener(function (changes) {
  // console.log(JSON.stringify(changes))
  if (!changes.ready) return;
  if (changes.ready.newValue == true) {
    let count = 5;
    let interval = setInterval(function () {
      audioNotification();
      count--;
      if (count == 0) {
        clearInterval(interval);
      }
    }, 1000);
  }
});
