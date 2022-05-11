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
const formFields = ["name", "queryType", "emailAddress", "applicationNumber"];
const submitButton = form.querySelector("button[type=submit]");

// Initialize on/off buttons
chrome.storage.local.get(({ enabled }) => toggleLink(enabled));

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const json = serializeToJson(form);
  chrome.storage.local.set({ formData: json }, function () {
    console.log("[popup.js] FormData: " + json);
  });

  // enable the loop
  enable();

  chrome.tabs.query({ active: true, currentWindow: true })
    .then((tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { message: "reload" },
      );
    })
    .then(function (res) {
      console.log(
        "[popup.js] Response recieved from content to reload in popup: ",
        res,
      );
    })
    .catch(console.error);
});

// Send stop message to disable the page
stopLink.addEventListener("click", disable);

chrome.storage.local.get(({ formData }) => {
  formFields.forEach((formField) => {
    let data = JSON.parse(formData);
    form.querySelector(`[name='${formField}']`).value = data[formField] || "";
  });
});

function toggleLink(enabled) {
  if (enabled) {
    stopLink.style.display = "block";
    disableForm();
  } else {
    stopLink.style.display = "none";
    reEnableForm();
  }
  chrome.action.setPopup({ popup: "popup/popup.html" });
}

function disableForm() {
  submitButton.disabled = "disabled";
  form.querySelector("select").disabled = "disabled";
  form.querySelectorAll("input").forEach((e) => {
    e.disabled = "disabled";
  });
}

function reEnableForm() {
  submitButton.disabled = "";
  form.querySelector("select").disabled = "";
  form.querySelector("button[type=submit]").disabled = "";
  form.querySelectorAll("input").forEach((e) => {
    e.disabled = "";
  });
}

function enable() {
  chrome.runtime.sendMessage({ message: "enable" })
    .then(({ message }) => toggleLink(message));
  disableForm();
}

function disable() {
  chrome.runtime.sendMessage({ message: "disable" })
    .then(({ message }) => toggleLink(message))
    .then(() => chrome.storage.local.set({ count: 0 }));
  chrome.action.setBadgeText({ text: "" });
  reEnableForm();
}
