const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/', (req, res) => {
    console.log('Received Telegram Update:', JSON.stringify(req.body, null, 2));

    if (req.body.message && req.body.message.new_chat_members) {
        const chatId = req.body.message.chat.id;
        const newMembers = req.body.message.new_chat_members;
        
        newMembers.forEach(member => {
            promoteUser(chatId, member.id);
        });
    }

    res.send('OK');
});

const axios = require('axios');
const BOT_TOKEN = process.env.BOT_TOKEN;  // 从环境变量获取 Token

// 提升用户为管理员
async function promoteUser(chatId, userId) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/promoteChatMember`;
    const payload = {
        chat_id: chatId,
        user_id: userId,
        can_change_info: false,
        can_post_messages: true,
        can_edit_messages: true,
        can_delete_messages: true,
        can_invite_users: true,
        can_restrict_members: false,
        can_pin_messages: true,
        can_manage_topics: false
    };

    try {
        const response = await axios.post(url, payload);
        console.log('Promotion Response:', response.data);
    } catch (error) {
        console.error('Error promoting user:', error.response ? error.response.data : error.message);
    }
}

app.listen(3000, () => {
    console.log('Bot Webhook is running on port 3000');
});
