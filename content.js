let storage = chrome.storage.local
let interval

document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete") {
    storage.get(["enabled"], function (storage) {
      if (!storage.enabled) {
        console.log("[content.js] DFA extension is not enabled!")
        return
      }
      interval = setInterval(loop, 500)
    })
  }
})

function loop() {
  src = document.querySelector("img[src*='chat-']").src
  if (src) {

    clearInterval(interval)
    if (src.match(/disabled/)) {
      chrome.runtime.sendMessage({ message: "notification" })
      storage.set({ enabled: false })
    } else if (src.match(/available/)) {
      storage.get("ready", function ({ ready }) {
        storage.set({ ready: true, enabled: false })
        ready || storage.set({ ready: true })
      })
    } else if (src.match(/limit/)) {
      storage.get("enabled", function ({ enabled }) {
        if (!enabled) return

        storage.get(["count"]).then(({ count }) => {
          return Promise.all([
            storage.set({ count: ++count }),
            chrome.runtime.sendMessage({
              message: "count",
              data: count.toString(),
            }),
          ])
        })

        setTimeout(() => window.location.reload(), 1000)
      })
    }
  }
}
