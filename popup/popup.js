const url = "https://www.dfa.ie/passports/contact/";
const stopButton = document.querySelector("#stopButton");
const runButton = document.querySelector("#runButton");

// Initialize on/off buttons
chrome.storage.local.get(({ enabled }) => toggleLink(enabled));

runButton.addEventListener("click", (event) => {
  event.preventDefault();

  chrome.runtime.sendMessage({ message: "enable" })
    .then(({ message }) => {
      toggleLink(message);
      disableForm();
    }).then(() => {
      chrome.tabs.query({ active: true, currentWindow: true })
        .then((tabs) => {
          chrome.tabs.reload(tabs[0].id);
        });
    });
});
chrome.storage.local.get(["enabled"], function ({ enabled }) {
  toggleLink(enabled);
});
// Send stop message to disable the page
stopButton.addEventListener("click", disable);

function toggleLink(enabled) {
  if (enabled) {
    stopButton.disabled = undefined;
    runButton.disabled = "disabled";
    disableForm();
  } else {
    stopButton.disabled = "disabled";
    runButton.disabled = undefined;
    reEnableForm();
  }
  chrome.action.setPopup({ popup: "popup/popup.html" });
}

function disableForm() {
  runButton.disabled = "disabled";
}

function reEnableForm() {
  runButton.disabled = undefined;
}

function enable() {
  chrome.runtime.sendMessage({ message: "enable" })
    .then(({ message }) => {
      toggleLink(message);
      disableForm();
    });
}

function disable() {
  chrome.runtime.sendMessage({ message: "disable" })
    .then(({ message }) => {
      toggleLink(message.enabled);
      chrome.storage.local.set({ count: 0 });
      chrome.action.setBadgeText({ text: "" });
      reEnableForm();
    });
}
