function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkImg() {
  let waitingImg = document.querySelector(
    "img[src='https://cdn.edgetier.com/dfa/chat-queue-over-limit.png']",
  );
  let offlineImg = document.querySelector(
    "img[src='https://cdn.edgetier.com/dfa/chat-disabled.png']",
  );
  let readyImg = document.querySelector(
    "img[src='https://cdn.edgetier.com/dfa/chat-available.png']",
  );

  let enabled = await chrome.storage.local.get("enabled");
  console.log("enabled", enabled.enabled);
  if (!enabled.enabled) {
    console.log("DFA extension is not enabled!");
    return;
  }

  if (waitingImg) {
    console.log("Waiting image...reload in 3 seconds");
    await sleep(3000);
    window.location.reload();
  } else if (readyImg) {
    console.log("Ready image found!");
    chrome.runtime.sendMessage({ dfaMessage: "removeWebRequestListener" });
    console.log("Click image");
    readyImg.click();
  }
}

chrome.runtime.onMessage.addListener(
  function (request, _sender, _sendResponse) {
    if (request.dfaMessage === "reload") {
      window.location.reload();
    }
  },
);

checkImg();
