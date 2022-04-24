const url = "https://www.dfa.ie/passports/contact/";

// function onPage () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//   console.log(tab)
// }

// let rule2 = {
//   conditions: [
//     new chrome.declarativeContent.PageStateMatcher({
//       pageUrl: { hostSuffix: '.dfa.ie', pathPrefix: '/passports/contact', schemes: ['https'] },
//       css: ["img[alt='Live chat is unavailable']"]
//     })
//   ],
//   actions: [ console.log('On The Page') ]
//   // actions: [ new chrome.declarativeContent.ShowAction() ]
// };

// chrome.runtime.onInstalled.addListener(function(_details) {
//   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//     chrome.declarativeContent.onPageChanged.addRules([rule2]);
//   });
// });

// chrome.runtime.onInstalled.addListener(() => {
//   // chrome.storage.sync.set({ color });
//   console.log(`PASSPORT: ${uri}`)
//   console.log('Default background color set to %cgreen', `color: ${color}`);
// });

// let element = document.querySelector('a.logging')
let element = document.uri;
console.log('element')
//   .addEventListener('click', (_a) => {
//   console.log('clicked')
// })

// chrome.runtime.sendMessage('get-user-data', (response) => {
//   // 3. Got an asynchronous response with the data from the background
//   console.log('received user data', response);
// });
