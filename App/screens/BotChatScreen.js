import React from 'react';
import { WebView } from 'react-native-webview';

const BotChatScreen = () => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://cdn.botpress.cloud/webchat/v3.0/inject.js"></script>
        <script src="https://files.bpcontent.cloud/2025/07/11/13/20250711135704-G1X0SRSH.js"></script>
      </head>
      <body>
        <h3>Đang tải chatbot...</h3>
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      style={{ flex: 1 }}
    />
  );
};

export default BotChatScreen; 