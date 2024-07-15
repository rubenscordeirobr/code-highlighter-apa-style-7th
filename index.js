
async function sayHello() {

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            alert('Hello from the service worker');
        }
    });
}
 
document.getElementById('btnTest').addEventListener('click', sayHello);  