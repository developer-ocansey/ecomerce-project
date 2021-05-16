const request = require('sync-request');
const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 8081;
const baseUrl = '/api/v1/';
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);
  const { conversationId } = socket.handshake.query;
  socket.join(conversationId);
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    sendMessage(data)
    data.authorization = null
    io.in(conversationId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} diconnected`);
    socket.leave(conversationId);
  });
});

server.listen(PORT, () => {
  console.log(`bcd.ng socket is listening on port ${PORT}`);
});

const sendMessage = (message) => {
  request(
    'POST',
    `https://api.bcd.ng${baseUrl}messages/add`,
    { json: {
        messageListId: message.conversationId,
        sentBy: message.sentBy,
        message: message.message,
      },
      headers:{'Authorization':message.authorization}});
}