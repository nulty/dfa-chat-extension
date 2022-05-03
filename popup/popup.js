const serializeToJson = (form) => {
  const formEntries = new FormData(event.target).entries();
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
chrome.storage.local.get("enabled", (r) => {
  toggleLink(r.enabled);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const json = serializeToJson(form);
  chrome.storage.local.set({ formdata: json }, function () {
    console.log("FormData: " + json);
  });

  // enable the loop
  chrome.storage.local.set({ enabled: true });
});

// Send stop message to the service to remove the listener from
// the page
stopLink.addEventListener("click", (event) => {
  chrome.storage.local.set({ enabled: false });
  chrome.storage.local.get("enabled", (store) => {
    toggleLink(store.enabled);
  });
});

startLink.addEventListener("click", (event) => {
  chrome.storage.local.set({ enabled: true });
  chrome.storage.local.get("enabled", (store) => {
    toggleLink(store.enabled);
  });
});
chrome.storage.local.get("formData", function (storage) {
  formFields.forEach((formField) => {
    let data = JSON.parse(storage.formData)
    form.querySelector(`input[name=${formField}]`).value = data[formField] || '';
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
