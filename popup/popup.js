const url = "https://www.dfa.ie/passports/contact/";
const form = document.querySelector("#contact-details");
const formFields = ["name", "queryType", "emailAddress", "applicationNumber"]

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formEntries = new FormData(event.target).entries();
  const json = Object.assign(
    ...Array.from(formEntries, ([x, y]) => ({ [x]: y })),
  );

  chrome.storage.local.set({ formData: JSON.stringify(json) }, function () {
    console.log("Value is set to " + JSON.stringify(json));
  });
});

chrome.storage.local.get("formData", function (storage) {
  formFields.forEach((formField) => {
    let data = JSON.parse(storage.formData)
    form.querySelector(`input[name=${formField}]`).value = data[formField] || '';
  });
});
