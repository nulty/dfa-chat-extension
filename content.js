function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

document.addEventListener("readystatechange", () => {
  if (document.readyState == "complete") {
    chrome.storage.local.get(["enabled"], function (storage) {
      console.log("enabled: ", storage.enabled);
      if (!storage.enabled) {
        console.log("[service.js] DFA extension is not enabled!");
        return;
      }
      setTimeout(function () {
        src = document.querySelector("img[src*='chat-']").src;
        if (src.match(/other/)) {
          chrome.runtime.sendMessage(
            { message: "notification" },
          );
          chrome.storage.local.set({ enabled: false });
        } else if (src.match(/available/)) {

          chrome.runtime.sendMessage(
            { message: { data: "limit" } },
          );
        } else if (src.match(/disabled/)) {
          chrome.storage.local.get(["count"])
            .then(({ count }) => {
              return Promise.all(
                [
                  chrome.storage.local.set({ count: ++count }),
                  chrome.runtime.sendMessage({ message: 'count', data: count.toString() })
                ],
              );
            })
            .then(() => chrome.tabs.reload(tabId))
            .catch((err) =>
              console.error("[service.js] ERROR in reloading code: ", err)
            );

          window.location.reload();
          // chrome.runtime.sendMessage(
          //   { message: { data: "limit" } },
          // );
        }
      }, 3000);
    });
  }
});

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
  function ({ message }, _sender, _reply) {
    console.log("[content.js] message received", message);
    if (message == "fillForm") {
      fillForm();
    }
  },
);
