function connectWebSocket(passwordAttempt) {
    // Initialize a new WebSocket connection with the password
    const ws = new WebSocket(`ws://athene.fi/ws/?password=${passwordAttempt}`);

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

    };
    ws.onmessage = function(event) {
        const base64Image = event.data;
        const imageContainer = document.getElementById('image-container');
    
        // Check if the image element already exists
        let img = document.querySelector('#image-container img');
        if (!img) {
            // If it doesn't exist, create a new img element
            img = document.createElement('img');
            imageContainer.appendChild(img); // Add the new img element to the DOM
        }
        // Update the src of the img element to the new image
        img.src = `data:image/jpeg;base64,${base64Image}`;
        img.style.maxWidth = '100%'; // Ensure the image fits within the container
        img.alt = 'Uploaded Image';
    };
    
    ws.onerror = function(error) {
        console.log('WebSocket error: ', error);
    };
}

// Initial password prompt
let password = prompt("Enter the WebSocket connection password:");
if (password !== null && password !== "") {
    connectWebSocket(password);
}