// Disable the action unless the current tab is dfa
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable();

  // initialize enabled to false
  chrome.storage.local.set({ enabled: false });

  // asynchronously fetch the alternate action icon
  // convert it to imagedata and pass it to  SetIcon
  alternateIcon().then((imageData) => {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
      let exampleRule = {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostSuffix: ".dfa.ie" },
          }),
        ],
        actions: [
          new chrome.declarativeContent.ShowAction(),
          new chrome.declarativeContent.SetIcon({ imageData }),
        ],
      };

      let rules = [exampleRule];
      chrome.declarativeContent.onPageChanged.addRules(rules);
    });
  });
});

async function alternateIcon() {
  let response = await fetch(chrome.runtime.getURL("images/white-img-16.png"));
  let blob = await response.blob();
  let imageBitmap = await createImageBitmap(blob);
  let osc = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
  let ctx = osc.getContext("2d");
  ctx.drawImage(imageBitmap, 0, 0);
  let imageData = ctx.getImageData(0, 0, osc.width, osc.height);
  return imageData;
}

let webRequestListener = (details) => {
  if (details.method == "OPTIONS") return;
  chrome.scripting.executeScript({
    target: { tabId: details.tabId },
    files: ["content.js"],
  });
};

chrome.webRequest.onCompleted.addListener(webRequestListener, {
  urls: ["https://dfa.edgetier.com/api/chat-enabled/1*"],
});

// Listen for messages
let messageListener = (request, sender, _sendResponse) => {
  console.log("(service) received: ", request.dfaMessage);

  if (request.dfaMessage === "removeWebRequestListener") {
    chrome.webRequest.onCompleted.removeListener(webRequestListener);
    console.log("removeWebRequestListener: Removed");
  }
};
chrome.runtime.onMessage.addListener(messageListener);

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
