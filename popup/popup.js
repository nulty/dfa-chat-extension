const url = "https://www.dfa.ie/passports/contact/";
const form = document.querySelector("#contact-details");
const formFields = ["name", "queryType", "emailAddress", "applicationNumber"]
const stopLink = document.querySelector("#stop");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formEntries = new FormData(event.target).entries();
  const json = Object.assign(
    ...Array.from(formEntries, ([x, y]) => ({ [x]: y })),
  );

  chrome.storage.local.set({ formData: JSON.stringify(json) }, function () {
    console.log("Value is set to " + JSON.stringify(json));
  });

  // enable the loop
  chrome.storage.local.set({ enabled: true });
});

// Send stop message to the service to remove the listener from
// the page
stopLink.addEventListener("click", (event) => {
  event.preventDefault();
  chrome.storage.local.set({ enabled: false });
});

chrome.storage.local.get("formData", function (storage) {
  formFields.forEach((formField) => {
    let data = JSON.parse(storage.formData)
    form.querySelector(`input[name=${formField}]`).value = data[formField] || '';
  });
});
