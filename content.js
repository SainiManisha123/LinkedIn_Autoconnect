console.log("Content script injected");

let isRunning = false;
let completedConnectionsCount = 0, totalConnections = 10, isHalted = false, port = null;

// Keep track of ongoing timeouts
let connectionTimeouts = [];

// Message listener for start and stop actions
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'start') {
        console.log('Start message received');
        startAutoConnect();
        sendResponse({ status: 'started' });
    } else if (request.action === 'stop') {
        console.log('Stop message received');
        stopAutoConnect();
        sendResponse({ status: 'stopped' });
    }
});

// Start auto-connecting to LinkedIn users
function startAutoConnect() {
    
    if (isRunning) return;  // Prevent multiple starts
    isRunning = true;
    console.log('Auto-connect started');

    // Disable the start button
    $('#startButton').prop('disabled', true);

    const connectBtnList = getConnectBtnList();

    connectBtnList.forEach((connectBtn, index) => {
        
        connectBtn.addEventListener('click', event => {
            setTimeout(() => {
                const sendNowNode = document.querySelector('#artdeco-modal-outlet [aria-label="Send now"]');
                if (sendNowNode) {
                    sendNowNode.click();
                }

                const sendWithoutNoteButton = $("button:contains('Send without a note')");
                if (sendWithoutNoteButton.length) {
                    sendWithoutNoteButton.click();  // Click the Send without a note button
                    console.log('Clicked Send without a note button');

                    // Close the pop-up after sending the connection request
                    const dismissButton = $("button.artdeco-modal__dismiss");
                    if (dismissButton.length) {
                        dismissButton.click();  // Click the Dismiss button to close the pop-up
                        console.log('Clicked Dismiss button to close pop-up');
                    }
                }

                completedConnectionsCount++;
                updateConnectionCount();  // Update count display
                
            }, 0);
        });
    });

    for (let i = 0; i < connectBtnList.length; i++) {
        const connectBtn = connectBtnList[i];

        // Generate a random delay between 5000ms (5s) and 10000ms (10s)
        const randomDelay = Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000;

        const timeoutId = setTimeout(() => {
            
            if (isHalted) return;
            if (completedConnectionsCount >= totalConnections) {
                return;
            }
            connectBtn.click();
        }, i * randomDelay);  // Apply random delay

        connectionTimeouts.push(timeoutId); // Store timeout ID
    }
}


function stopAutoConnect() {
    
    if (!isRunning) return;  // Prevent stopping if not running

    // Clear all ongoing timeouts
    connectionTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    connectionTimeouts = []; // Reset the array

    isRunning = false;
    isHalted = true;
    
    console.log('Auto-connect stopped');

    // Enable the start button
    $('#startButton').prop('disabled', false);
}


// Get a list of connect buttons
function getConnectBtnList() {
    
    const buttons = $('.artdeco-button');  

    // Filter buttons that contain the text "Connect" and are not muted
    const connectButtons = buttons.filter((index, button) => {
        
        return $(button).text().trim() === "Connect" && 
               !$(button).hasClass('artdeco-button--muted');
    });

    // Convert the filtered jQuery object to a regular array (if needed)
    return Array.from(connectButtons);
}

// Calculate percentage of completed connections
function calculatePercent() {
    return Math.round((completedConnectionsCount / totalConnections) * 100);
}

// Update the displayed connection count
// function updateConnectionCount() {debugger;
//     document.getElementById('connectionCount').innerHTML = completedConnectionsCount;  // Display the count directly
// }

function updateConnectionCount() {
    chrome.runtime.sendMessage({ action: 'updateCount', count: completedConnectionsCount });
}


