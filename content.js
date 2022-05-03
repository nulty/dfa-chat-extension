function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkImg(doc) {
  let img = document.querySelector(
    "img[src='https://cdn.edgetier.com/dfa/chat-disabled.png']",
  );
  let enabled = await chrome.storage.local.get("enabled");
  console.log("enabled", enabled.enabled);
  if (!enabled.enabled) {
    console.log("DFA extension is not enabled!");
    return;
  }

  if (!img) {
    console.log("IMAGE FOUND")
    console.log("image: ", img)
  } else {
    await sleep(3000);
    window.location.reload();
  }
}

checkImg();
