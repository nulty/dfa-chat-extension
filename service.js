function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function webRequestListener({ url, tabId }) {
  let { enabled } = await chrome.storage.local.get(["enabled"]);
  if (!enabled) {
    console.log("[service.js] DFA extension is not enabled!");
    return;
  }

  if (url.match(/disabled/)) {
    chrome.storage.local.set({ enabled: false });
    console.log("Chat is disabled");
  } else if (url.match(/limit/)) {
    console.log("Going round again");
    chrome.storage.local.get(["count"])
      .then(({ count }) => chrome.storage.local.set({ count: ++count }))
      .then(() => chrome.storage.local.get(["enabled", "count"]))
      .then(({ count }) => {
        chrome.action.setBadgeText({ text: count.toString() });
      })
      .then((res) => {
        console.log("[service.js] chrome.tabs.sendMessage: ", res);
      })
      .then(await sleep(3000))
      .then(chrome.tabs.sendMessage(tabId, { message: "reload" }))
      .catch((err) =>
        console.error("[service.js] ERROR chrome.tabs.sendMessage: ", err)
      );
  } else if (url.match(/available/)) {
    chrome.tabs.sendMessage(tabId, { message: "fillForm" });
  }
}

chrome.webRequest.onCompleted.addListener(webRequestListener, {
  urls: ["https://cdn.edgetier.com/dfa/chat*.png"],
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("[service.js] INSTALLED ");
  chrome.action.disable();

  chrome.storage.local.set({ count: 0 });
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
