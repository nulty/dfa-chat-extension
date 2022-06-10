chrome.runtime.onInstalled.addListener(() => {
  console.log("[service.js] INSTALLED ");
  chrome.action.disable();

  chrome.storage.local.set({ count: 0 });
  // initialize enabled to false
  chrome.storage.local.set({ enabled: false }, function () {
    console.log("storage: ", false);
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
    case "notification":
      chrome.notifications.create(
        {
          title: "DFA Chat is disabled",
          iconUrl: chrome.runtime.getURL("images/white-img-16.png"),
          message: "Try during between 9am and 4.30pm",
          type: "basic",
          eventTime: Date.now(),
        },
      );
      break;
    case "count":
      chrome.action.setBadgeText({ text: request.data });
      break;
    case "ready":
      chrome.notifications.create(
        {
          title: "The DFA Chat form is ready!",
          iconUrl: chrome.runtime.getURL("images/white-img-16.png"),
          message: "Fill in the form promptly!",
          type: "basic",
          eventTime: Date.now(),
        },
      );
      chrome.tabs.sendMessage(tabId, { message: "fillForm" });
      break;
    case "enable":
      chrome.storage.local.set({ enabled: true }, function () {
        reply({ message: true });
      });
      break;
    case "disable":
      chrome.storage.local.set({ enabled: false }, function () {
        reply({ message: "enabled:  false" });
      });
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
