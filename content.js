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

  let { enabled } = await chrome.storage.local.get("enabled");
  console.log("[content.js] checkImg.enabled", enabled);
  if (!enabled) {
    console.log("[content.js] DFA extension is not enabled!");
    return;
  }

  if (waitingImg) {
    console.log("[content.js] Waiting image...reload in 3 seconds");
    sleep(3000).then(() => window.location.reload());
  } else if (readyImg) {
    console.log("[content.js] Ready image found!");
    chrome.storage.local.set({ enabled: false });
    console.log("[content.js] Click image");
    readyImg.click();
  }
}

chrome.runtime.onMessage.addListener(
  function (request, _sender, reply) {
    console.log("[content.js] message received", request);
    if (request.dfaMessage === "checkImg") {
      console.log("[content.js] checkImg");
      checkImg();
      reply("[content.js] checkImg executed...")
    }
  },
);

checkImg();
