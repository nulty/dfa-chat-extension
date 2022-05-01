function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkImg(doc) {
  let img = document.querySelector(
    "img[src='https://cdn.edgetier.com/dfa/chat-disabled.png']",
  );

  if (!img) {
    console.log("IMAGE FOUND")
    console.log("image: ", img)
  } else {
    await sleep(3000);
    window.location.reload();
  }
}

checkImg();
