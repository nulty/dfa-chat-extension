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
    console.log("FormData: " + json);
  });

  // enable the loop
  chrome.storage.local.set({ enabled: true });
  chrome.storage.local.get(({ enabled }) => toggleLink(enabled));
});

// Send stop message to the service to remove the listener from
// the page
stopLink.addEventListener("click", (_event) => {
  chrome.storage.local.set({ enabled: false });
  chrome.storage.local.get(({ enabled }) => toggleLink(enabled));
});

startLink.addEventListener("click", (_event) => {
  chrome.storage.local.set({ enabled: true });
  chrome.storage.local.get(({ enabled }) => toggleLink(enabled));
});

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
