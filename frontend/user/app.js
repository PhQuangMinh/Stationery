const Stomp = require('@stomp/stompjs');
const SockJS = require('sockjs-client');  // Nếu bạn sử dụng SockJS

// Khởi tạo WebSocket
var socket = new SockJS('http://localhost:8080/websocket');

// Khởi tạo Stomp Client
var stompClient = new Stomp.Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/websocket'),
    debug: (str) => { console.log(str); }, // Log toàn bộ sự kiện
    onConnect: async (frame) => {
        console.log('Connected: ' + frame);

        // // Kiểm tra xem có thể gửi tin nhắn không
        // stompClient.publish({
        //     destination: "/app/send",
        //     body: "Hello từ client",  // Không cần JSON.stringify()
        //     headers: { "content-type": "text/plain" }  // Hoặc bỏ headers nếu không cần
        // });

        stompClient.publish({
            destination: "/app/send",
            body: JSON.stringify({
                message: "Hello từ client",
                status: "NEW",
                link: "http://example.com",
                type: "INFO",
                usernameReceiver: "minh"
            }),
            headers: { "content-type": "application/json" }
        });
        
        
        console.log("Message sent!");
    },
    onStompError: (frame) => {
        console.error('STOMP error: ' + frame);
    }
});


console.log("Đang kết nối...");

// Kết nối đến server WebSocket
stompClient.activate();
