function connectWebSocket(passwordAttempt) {
    // Initialize a new WebSocket connection with the password
    const ws = new WebSocket(`ws://localhost:8888/?password=${passwordAttempt}`);

    ws.onopen = function() {
        console.log('WebSocket connection established');
    };

    ws.onerror = function(error) {
        console.log('WebSocket error: ', error);
        // Optionally, you could decide to prompt the user again here if there's an error.
    };

    ws.onclose = function(event) {
        // Check if the close event was due to an authentication failure
        let newPassword = prompt("Connection failed. Please enter the WebSocket connection password again:");
            if (newPassword !== null && newPassword !== "") {
                connectWebSocket(newPassword);
            }
        if (event.code === 4000) { // Assuming the server uses this code for auth failures
            
        } else {
            console.log('WebSocket closed. Please check the connection or server.');
        }
    };
}

// Initial password prompt
let password = prompt("Enter the WebSocket connection password:");
if (password !== null && password !== "") {
    connectWebSocket(password);
}
