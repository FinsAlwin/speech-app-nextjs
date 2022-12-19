export default (io, socket) => {
  const createdMessage = (msg) => {
    socket.broadcast.emit("newIncomingMessage", msg);
  };

  const callResponse = (msg) => {
    socket.broadcast.emit("inComingCallResponse", msg);
  };

  const congratsSend = (msg) => {
    socket.broadcast.emit("congratsRes", msg);
  };

  socket.on("createdMessage", createdMessage);

  socket.on("callResponse", callResponse);

  socket.on("congratsSend", congratsSend);
};
