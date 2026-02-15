const messageContainer = document.getElementById('messageContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearChat');

let conversationHistory = [];

// Your API configuration
const API_KEY = 'your-api-key-here'; // Replace with your actual API key
const API_URL = 'https://api.anthropic.com/v1/messages';

// Send message
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    
    // Add user message to UI
    addMessage(message, 'user');
    userInput.value = '';
    sendBtn.disabled = true;
    
    // Add to conversation history
    conversationHistory.push({
        role: 'user',
        content: message
    });
    
    // Show loading indicator
    const loadingDiv = addMessage('Thinking...', 'assistant', true);
    
    try {
        // Call API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 4096,
                messages: conversationHistory
            })
        });
        
        const data = await response.json();
        
        // Remove loading indicator
        loadingDiv.remove();
        
        // Add AI response
        const aiResponse = data.content[0].text;
        addMessage(aiResponse, 'assistant');
        
        // Add to conversation history
        conversationHistory.push({
            role: 'assistant',
            content: aiResponse
        });
        
    } catch (error) {
        loadingDiv.remove();
        addMessage('Error: ' + error.message, 'assistant');
    }
    
    sendBtn.disabled = false;
}

// Add message to UI
function addMessage(text, sender, isLoading = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (isLoading) {
        contentDiv.innerHTML = '<span class="loading"></span>';
    } else {
        // Format code blocks
        contentDiv.innerHTML = formatMessage(text);
    }
    
    messageDiv.appendChild(contentDiv);
    messageContainer.appendChild(messageDiv);
    messageContainer.scrollTop = messageContainer.scrollHeight;
    
    return messageDiv;
}

// Format message with code blocks
function formatMessage(text) {
    // Simple code block formatting
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/\n/g, '<br>');
    return text;
}

// Clear chat
clearBtn.addEventListener('click', () => {
    messageContainer.innerHTML = `
        <div class="message assistant">
            <div class="message-content">
                Hi! I'm your AI coding assistant. How can I help you today?
            </div>
        </div>
    `;
    conversationHistory = [];
});

// Send on button click
sendBtn.addEventListener('click', sendMessage);

// Send on Enter (Shift+Enter for new line)
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
