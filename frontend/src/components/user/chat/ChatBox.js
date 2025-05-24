import React, { useState, useRef, useEffect } from 'react';
import './ChatBox.css';

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = inputMessage.trim();
        setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await fetch(`http://localhost:8080/gemini/ask?userPrompt=${encodeURIComponent(userMessage)}`, {
                method: 'POST',
            });
            
            const botResponse = await response.text();
            setMessages(prev => [...prev, { text: botResponse, isUser: false }]);
        } catch (error) {
            console.error('Error getting bot response:', error);
            setMessages(prev => [...prev, { 
                text: "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.", 
                isUser: false 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`chat-box-container ${isOpen ? 'open' : ''}`}>
            <div className="chat-box-header" onClick={() => setIsOpen(!isOpen)}>
                <span>Chat với Bot</span>
                <button className="toggle-button">
                    {isOpen ? '▼' : '▲'}
                </button>
            </div>
            
            {isOpen && (
                <>
                    <div className="chat-messages">
                        {messages.map((message, index) => (
                            <div 
                                key={index} 
                                className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
                            >
                                {message.text}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message bot-message loading">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <form onSubmit={handleSubmit} className="chat-input-container">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            className="chat-input"
                        />
                        <button type="submit" className="send-button" disabled={isLoading}>
                            Gửi
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default ChatBox; 