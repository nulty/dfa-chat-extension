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
  // .catch(console.error);
});

// Send stop message to disable the page
stopLink.addEventListener("click", disable);

chrome.storage.local.get(({ formData }) => {
  formFields.forEach((formField) => {
    let data = JSON.parse(formData || "{}");
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
  console.log('reenable')
  submitButton.disabled = undefined;
  form.querySelector("select").disabled = undefined;
  form.querySelector("button[type=submit]").disabled = undefined;
  form.querySelectorAll("input").forEach((e) => {
    e.disabled = undefined;
  });
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
      toggleLink(message)
      chrome.storage.local.set({ count: 0 })
      chrome.action.setBadgeText({ text: "" });
      reEnableForm();
    })
}
