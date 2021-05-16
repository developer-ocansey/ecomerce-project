"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sync_request_1 = __importDefault(require("sync-request"));
const server = require("http").createServer();
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});
const SOCKETPORT = process.env.SOCKETPORT || 8082;
const baseUrl = process.env.BASE_URL || '/api/v1/';
const PORT = process.env.PORT || 8081;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
io.on("connection", (socket) => {
    console.log(`Client ${socket.id} connected`);
    const { conversationId } = socket.handshake.query;
    socket.join(conversationId);
    socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
        sendMessage(data);
        data.authorization = null;
        io.in(conversationId).emit(NEW_CHAT_MESSAGE_EVENT, data);
    });
    socket.on("disconnect", () => {
        console.log(`Client ${socket.id} diconnected`);
        socket.leave(conversationId);
    });
});
server.listen(SOCKETPORT, () => {
    console.log(`bcd.ng socket is listening on port ${SOCKETPORT}`);
});
const sendMessage = (message) => {
    sync_request_1.default('POST', `http://localhost:${PORT}${baseUrl}messages/add`, { json: {
            messageListId: message.conversationId,
            sentBy: message.sentBy,
            message: message.message,
        },
        headers: { 'Authorization': message.authorization } });
};
// const getMessage = (message: any, conversationId: number) => {
//   var res = request(
//     'GET',
//     `http://localhost:${PORT}${baseUrl}messages/${conversationId}`,
//     {headers:{'Authorization': message.authorization}}
//  );
//   console.log(res)
//   return JSON.parse(res.getBody('utf8')).data
// }
