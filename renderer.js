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

    // Basic styling for message
    messageElement.style.textAlign = 'left';
    messageElement.style.margin = '10px 0';
    messageElement.style.padding = '10px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.whiteSpace = 'pre-wrap';
    messageElement.style.fontFamily = 'Courier, monospace';
    messageElement.style.backgroundColor = message.startsWith('You') ? '#333' : '#000';

    // Clean up the message
    message = message.replace(/^You: /, "").replace(/^AI: /, "");

    // Adjusted regex to capture language name
    const codeRegex = /```(\w+)[ \n]([^`]+)```/g;
    message = message.replace(codeRegex, (match, lang, code) => {
        if (["python", "javascript", "java", "c", "c++", "cpp", "c#", "csharp", "html", "css", "php", "ruby", "go", "swift", "kotlin", "typescript", "rust", "scala", "r", "sql", "shell", "bash", "powershell", "perl", "lua", "dart", "haskell", "erlang", "elixir", "clojure", "f#", "ocaml", "racket", "julia", "nim", "crystal", "lisp", "scheme", "smalltalk", "forth", "prolog", "pascal", "ada", "fortran", "cobol", "abap", "apl", "pl/i", "rexx", "tcl", "verilog", "vhdl", "systemverilog", "v", "assembly", "objective-c", "objective-j", "actionscript", "scala", "groovy", "perl6", "raku", "coffee", "coffeescript", "jsx", "tsx", "reason", "ocaml"].includes(lang.toLowerCase())) {
            return `<div class="code-block" style="padding: 5px; border-radius: 4px; cursor: pointer;"><pre><code class="language-${lang}">${code}</code></pre></div>`;
            // return `<pre><code class="language-${lang}">${code}</code></pre>`;
        }
        return match;
    });


    messageElement.innerHTML = message;

    chatDiv.appendChild(messageElement);
    // call reHighlight function that's defined in index.html
    reHighlight();
    chatDiv.scrollTop = chatDiv.scrollHeight;
    // hljs.highlightBlock(messageElement);
    // document.querySelectorAll('pre code').forEach(block => {
    //     hljs.highlightBlock(block);
    // });

    // Clipboard copy functionality
    document.querySelectorAll('.code-block').forEach(block => {
        block.addEventListener('click', () => {
            navigator.clipboard.writeText(block.textContent).then(() => {
                console.log('Code copied to clipboard!');
                // Optionally, provide user feedback here
            }).catch(err => {
                console.error('Error copying code to clipboard: ', err);
            });
        });
    });
}


 function clearChat() {
    const chatDiv = document.getElementById('chat');
    chatDiv.innerHTML = '';
    messages = [
        { role: "system", content: "You are a helpful assistant." }
    ];
 }