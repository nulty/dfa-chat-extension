let webRequestListener = (details) => {
  if (details.method == "OPTIONS") return;
  console.log("[service.js] webRequestListener executed, tab ", details.tabId);

  chrome.tabs.sendMessage(details.tabId, { dfaMessage: "checkImg" })
    .then((res) => {
      console.log("[service.js] chrome.tabs.sendMessage: ", res);
    })
    .catch((err) => console.error("[service.js] ERROR chrome.tabs.sendMessage: ", err));
};

chrome.runtime.onInstalled.addListener(() => {
  console.log("[service.js] INSTALLED ");
  chrome.action.disable();

  // initialize enabled to false
  chrome.storage.local.set({ enabled: false });

  chrome.webRequest.onCompleted.addListener(webRequestListener, {
    urls: ["https://dfa.edgetier.com/api/chat-enabled/1*"],
  });

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

function messageListener(request, _sender, reply) {
  switch (request.message) {
    case "enable":
      chrome.storage.local.set({ enabled: true })
        .then(() => chrome.storage.local.get("enabled"))
        .then(({ enabled }) => reply({ message: enabled }));
      break;
    case "disable":
      chrome.storage.local.set({ enabled: false })
        .then(() => chrome.storage.local.get("enabled"))
        .then(({ enabled }) => reply({ message: enabled }));
      break;

    default:
  }
  return true;
}

chrome.runtime.onMessage.addListener(messageListener);
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

async function getCurrentTab() {
  let queryOptions = { active: true, currentWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
