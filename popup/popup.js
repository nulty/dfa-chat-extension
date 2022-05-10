const serializeToJson = (form) => {
  const formEntries = new FormData(form).entries();
  const json = Object.assign(
    ...Array.from(formEntries, ([x, y]) => ({ [x]: y })),
  );
  return JSON.stringify(json);
};
const url = "https://www.dfa.ie/passports/contact/";
const form = document.querySelector("#contact-details");
const stopLink = document.querySelector("#stop");
const startLink = document.querySelector("#start");
const formFields = ["name", "queryType", "emailAddress", "applicationNumber"];

// Initialize on/off buttons
chrome.storage.local.get(({ enabled }) => toggleLink(enabled));

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const json = serializeToJson(form);
  chrome.storage.local.set({ formData: json }, function () {
    console.log("[popup.js] FormData: " + json);
  });

  // enable the loop
  enable()

  chrome.tabs.query({ active: true, currentWindow: true })
    .then((tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { message: "reload" },
        function (res) {
          console.log( "[popup.js] Response recieved from content to reload in popup: ", res);
        },
      );
    });
});

// Send stop message to disable the page
stopLink.addEventListener("click", disable);

startLink.addEventListener("click", enable);

chrome.storage.local.get(({ formData }) => {
  formFields.forEach((formField) => {
    let data = JSON.parse(formData);
    form.querySelector(`[name='${formField}']`).value = data[formField] || "";
  });
});

function toggleLink(enabled) {
  if (enabled) {
    startLink.style.display = "none";
    stopLink.style.display = "inline";
  } else {
    stopLink.style.display = "none";
    startLink.style.display = "inline";
  }
  chrome.action.setPopup({ popup: "popup/popup.html" });
}

function enable() {
  chrome.runtime.sendMessage({ message: "enable" })
    .then(({ message }) => toggleLink(message));
}

function disable() {
  chrome.runtime.sendMessage({ message: "disable" })
    .then(({ message }) => toggleLink(message));

}
