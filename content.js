let interval;
document.addEventListener("readystatechange", () => {
  if (document.readyState == "complete") {
    chrome.storage.local.get(["enabled"], function (storage) {
      if (!storage.enabled) {
        console.log("[content.js] DFA extension is not enabled!");
        return;
      }

      interval = setInterval(loop, 500);
    });
  }
});

function loop() {
  src = document.querySelector("img[src*='chat-']").src;
  if (src) {
    clearInterval(interval);
    if (src.match(/disabled/)) {
      chrome.runtime.sendMessage(
        { message: "notification" },
      );
      chrome.storage.local.set({ enabled: false });
    } else if (src.match(/available/)) {
      chrome.runtime.sendMessage(
        { message: { data: "ready" } },
      );
    } else if (src.match(/limit/)) {
      chrome.storage.local.get("enabled", function ({ enabled }) {
        if (!enabled) return;

        chrome.storage.local.get(["count"])
          .then(({ count }) => {
            return Promise.all(
              [
                chrome.storage.local.set({ count: ++count }),
                chrome.runtime.sendMessage({
                  message: "count",
                  data: count.toString(),
                }),
              ],
            );
          })

        setTimeout(() => window.location.reload(), 1000);
      });
    }
  }
}
