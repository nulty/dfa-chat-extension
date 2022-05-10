function fillForm() {
  let readyImg = document.querySelector(
    "img[src='https://cdn.edgetier.com/dfa/chat-available.png']",
  );
  console.log("[content.js] Ready image found!");
  chrome.storage.local.set({ enabled: false });
  console.log("[content.js] Click image");
  readyImg.click();
  console.log("[content.js] Find the form:");
  let form = window.frames[1].document.forms[0];
  console.log("[content.js] Found form:", form);

  console.log("[content.js] Fill in the form");
  chrome.storage.local.get("formData", function (storage) {
    let formData = JSON.parse(storage.formData);
    console.log("[content.js] formData: ", formData);

    console.log("[content.js] Choose Query Type: ");
    form.querySelector(".react-select__single-value").innerHTML =
      formData.queryType || "Other";
    form.getElementsByClassName("react-select__input")[0].value =
      formData.queryType || "Other";
    console.log("[content.js] Set name: ");
    form.querySelector("input#name").value = formData.name || "??";
    console.log("[content.js] Set email: ");
    form.querySelector("input#email_address").value = formData.emailAddress ||
      "??";
    console.log("[content.js] Set ApplicationNumber: ");
    form.querySelector("input#booking_id").value = formData.applicationNumber ||
      "??";

    console.log("[content.js] Clicking button");
    form.querySelector("button[type=submit]").click();
  });
}

chrome.runtime.onMessage.addListener(
  function (request, _sender, reply) {
    console.log("[content.js] message received", request.message);
    if (request.message == "fillForm") {
      fillForm();
    } else if (request.message == "reload") {
      reply("Page reloaded");
      window.location.reload();
    }
    return true;
  },
);
