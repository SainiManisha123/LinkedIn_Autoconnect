document.getElementById('start').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0].url.includes('linkedin.com/search/results/people')) {
            chrome.tabs.sendMessage(tabs[0].id, { action: 'start' }, (response) => {
                console.log('Start message sent', response);
                document.getElementById('start').disabled = true; // Disable the start button
                document.getElementById('stop').disabled = false; // Enable the stop button
            });
        } else {
            console.log('This is not a LinkedIn search page');
        }
    });
});

document.getElementById('stop').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'stop' }, (response) => {
            console.log('Stop message sent', response);
            document.getElementById('stop').disabled = true; // Disable the stop button after stopping
            document.getElementById('start').disabled = false; // Enable the start button
        });
    });
});

// Listener to receive messages from content script
chrome.runtime.onMessage.addListener((request, sender) => {
    if (request.message === 'updateCount') {
        document.getElementById('connectionCount').innerText = `Connections Sent: ${request.count}`; // Update the displayed count
    }
});

document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.action === 'updatePopup') {debugger;
            document.getElementById('connectionCount').innerHTML = message.count;
        }
    });
});

