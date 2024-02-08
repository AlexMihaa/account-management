// function clearCash() {
//     // Очищаем куки
//     chrome.cookies.getAll({ domain: 'posiflora.com' }, function(cookies) {
//         cookies.forEach(function(cookie) {
//             chrome.cookies.remove({ url: "https://" + cookie.domain + cookie.path, name: cookie.name });
//         });
//     });
//
//     // Очищаем sessionStorage
//     chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
//         chrome.scripting.executeScript({
//             target: { tabId: tabs[0].id },
//             function: function() {
//                 sessionStorage.clear();
//             }
//         });
//     });
//
//     // Очищаем localStorage
//     chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
//         chrome.scripting.executeScript({
//             target: { tabId: tabs[0].id },
//             function: function() {
//                 localStorage.clear();
//             }
//         });
//     });
//
//     // Очищаем кэш
//     chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
//         chrome.browsingData.remove({
//             "since": 0
//         }, {
//             "appcache": true,
//             "cache": true
//         }, function() {
//             console.log("Cache cleared");
//         });
//     });
//
//     // После выполнения всех операций вы можете обновить страницу, чтобы увидеть эффекты очистки
//     chrome.tabs.reload();
// }
//
// export { clearCash };
