
async function sayHello() {

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            alert('Hello from the service worker');
        }
    });
}
 
window.addEventListener('DOMContentLoaded',  window_onload);

async function window_onload() {

    const elementIsActivated = document.getElementById('chkIsActivated');
    const elementUseCtrl = document.getElementById('chkUseCtrl');

    elementIsActivated.addEventListener('change', async () => {
        elementUseCtrl.disabled = !elementIsActivated.checked;
        await setChromeStorageAsync('ContextMenuIsActivated', elementIsActivated.checked);
        setWindowGlobalAsync('__ContextMenuIsActivated', elementIsActivated.checked);
    });

    elementUseCtrl.addEventListener('change', async () => {
        await setChromeStorageAsync('ContextMenuUseCtrl', elementUseCtrl.checked);
        setWindowGlobalAsync('__ContextMenuUseCtrl', elementUseCtrl.checked);
    });


    const isActivated = await getChromeStorageAsync('ContextMenuIsActivated', true);
    const useCtrl = await getChromeStorageAsync('ContextMenuUseCtrl', true);
 
    if(elementIsActivated.checked!= isActivated)
        elementIsActivated.checked = isActivated;

    if (elementUseCtrl.checked != useCtrl)
        elementUseCtrl.checked = useCtrl;

    if (elementUseCtrl.disabled != !isActivated)
        elementUseCtrl.disabled =  !isActivated;

}
 

async function getChromeStorageAsync(key, defaultValue)
{
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, (data) => {
            if (data[key] == undefined) {
                resolve(defaultValue);
            } else {
                resolve(data[key]);
            }
        });
    });
}

async function setChromeStorageAsync(key, value)
{
    return new Promise((resolve, reject) => {
        chrome.storage.local.set({ [key]: value }, () => {
            resolve();
        });
    });
}   
    
async function setWindowGlobalAsync(key, value)
{
    return new Promise((resolve, reject) => {

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const tabId = tabs[0].id;

                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: () => {
                        window[key] = value;
                    }
                });
            }
        });

    });
}