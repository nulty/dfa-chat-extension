const serializeToJson = (form) => {
  const formEntries = new FormData(event.target).entries();
  const json = Object.assign(
    ...Array.from(formEntries, ([x, y]) => ({ [x]: y })),
  );
  return JSON.stringify(json);
};
const url = "https://www.dfa.ie/passports/contact/";
const form = document.querySelector("#contact-details");
const formFields = ["name", "queryType", "emailAddress", "applicationNumber"]
const stopLink = document.querySelector("#stop");

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
  event.preventDefault();
  chrome.storage.local.set({ enabled: false });
});

chrome.storage.local.get("formData", function (storage) {
  formFields.forEach((formField) => {
    let data = JSON.parse(storage.formData)
    form.querySelector(`input[name=${formField}]`).value = data[formField] || '';
  });
});
