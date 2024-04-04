const { ipcRenderer } = require('electron');
let messages = [
    { role: "system", content: "You are a helpful assistant." }
    ];
// const 
document.getElementById('userInput').addEventListener('keypress', async (event) => {
    if (event.key === 'Enter') {
        
        console.log("messages");
        const inputField = document.getElementById('userInput');
        const userText = inputField.value;
        displayInChat(`You: ${userText}`);
        inputField.value = ''; 
        // sleep for 0.5 seconds
        await new Promise(r => setTimeout(r, 500));
        messages.push({ role: "user", content: userText });
        // Clear input field
        const completion = ipcRenderer.sendSync('create-completion', messages);
        // const completion = await openai.chat.completions.create({
        //     messages: [
        //         { role: "system", content: "You are a helpful assistant." },
        //         { role: "user", content: userText }
        //     ],
        //     model: "gpt-3.5-turbo",
        // });

        const aiResponse = completion.choices[0].message;
        messages.push({ role: "assistant", content: aiResponse.content });
        displayInChat(`AI: ${aiResponse.content}`);
    }
});

function displayInChat(message) {
    const chatDiv = document.getElementById('chat');
    const messageElement = document.createElement('p');
   
    
    // Add styling to justify the text and format code blocks
    messageElement.style.textAlign = 'left';
    messageElement.style.backgroundColor = message.startsWith('You') ? '#333' : '#000';
    // remove You or AI from the message
    message = message.replace("You: ", "");
    message = message.replace("AI: ", "");
    messageElement.textContent = message;
    messageElement.style.whiteSpace = 'pre-wrap';
    messageElement.style.fontFamily = 'Courier, monospace'; // Use monospace font for code-like appearance
    messageElement.style.margin = '10px 0'; // Add some vertical spacing between messages
    messageElement.style.padding = '10px'; // Add some padding around the text
    messageElement.style.borderRadius = '5px'; // Round the corners for a chat bubble appearance
     // Different background colors for user and AI messages
     chatDiv.appendChild(messageElement);
     chatDiv.scrollTop = chatDiv.scrollHeight;
 }

 function clearChat() {
    const chatDiv = document.getElementById('chat');
    chatDiv.innerHTML = '';
    messages = [
        { role: "system", content: "You are a helpful assistant." }
    ];
 }