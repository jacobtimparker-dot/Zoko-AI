const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve your HTML/CSS/JS

const anthropic = new Anthropic({
    apiKey: 'your-api-key-here' // Safe on server-side!
});

app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        
        const message = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            messages: messages
        });
        
        res.json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
