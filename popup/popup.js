const url = "https://www.dfa.ie/passports/contact/"
const stopButton = document.querySelector("#stopButton")
const runButton = document.querySelector("#runButton")

// Initialize on/off buttons
chrome.storage.local.get(({ enabled }) => toggleLink(enabled))


runButton.addEventListener("click", (event) => {
  event.preventDefault()

  chrome.storage.local
    .set({ enabled: true })
    .then(() => {
      toggleLink(true)
      disableForm()
    })
    .then(() => {
      chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        chrome.tabs.reload(tabs[0].id)
      })
    })
})
chrome.storage.local.get(["enabled"], function ({ enabled }) {
  toggleLink(enabled)
})
chrome.storage.local.onChanged.addListener(function (changes, _areaName) {
  enabled = changes.enabled && changes.enabled.newValue
  ready = changes.ready && changes.ready.newValue

  if (enabled || ready) {
    toggleLink(false)
  } else {
    toggleLink(true)
  }
})

// Send stop message to disable the page
stopButton.addEventListener("click", disable)

function toggleLink(enabled) {
  if (enabled) {
    stopButton.disabled = undefined
    runButton.disabled = "disabled"
    disableForm()
  } else {
    stopButton.disabled = "disabled"
    runButton.disabled = undefined
    reEnableForm()
  }
  chrome.action.setPopup({ popup: "popup/popup.html" })
}

function disableForm() {
  runButton.disabled = "disabled"
}

function reEnableForm() {
  runButton.disabled = undefined
}

function enable() {
  chrome.storage.local.set({ enabled: true }).then(() => {
    toggleLink(true)
    disableForm()
  })
}

function disable() {
  chrome.storage.local
    .set({ enabled: false, count: 0, ready: false })
    .then(() => {
      toggleLink(false)
      chrome.action.setBadgeText({ text: "" })
      reEnableForm()
    })
}

