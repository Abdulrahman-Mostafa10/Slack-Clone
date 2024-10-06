const path = require("path");
const express = require("express");
const socketIo = require("socket.io");

const nameSpaces = require("./data/namespaces");
const Room = require("./classes/room");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

const currentUsers = [
  { name: "Abdelrahman", loggedIn: false },
  { name: "Ali", loggedIn: false },
];

const io = socketIo(server);

app.get("/change-namespace", (req, res, next) => {
  nameSpaces[0].addRoom(new Room(0, "Deleted Articles", 0));

  const namespaceSockets = io.of(nameSpaces[0].endPoint).sockets;
  if (Object.keys(namespaceSockets).length > 0) {
    io.of(nameSpaces[0].endPoint).emit("update-namespace", nameSpaces[0]);
  }

  res.json(nameSpaces[0]);
});

io.on("connection", (socket) => {
  console.log(`${socket.id} is connected`);

  socket.on("clientConnect", () => {
    let currentUser;
    if (!currentUsers[0].loggedIn) {
      currentUser = currentUsers[0].name;
      currentUsers[0].loggedIn = true;
    } else if (!currentUsers[1].loggedIn) {
      currentUser = currentUsers[1].name;
      currentUsers[1].loggedIn = true;
    } else {
      currentUser = "Omar";
    }

    console.log(currentUser);
    socket.emit("welcome", {
      greeting: "Welcome to the server",
      currentUser: currentUser,
    });
    socket.emit("namespaces-list", nameSpaces);
  });

  socket.on("disconnect", () => {
    // console.log(${socket.id} has disconnected);
  });
});

nameSpaces.forEach((nameSpace) => {
  const nsp = io.of(nameSpace.endPoint);

  nsp.on("connection", (socket) => {
    socket.on("joinRoom", async (roomObject, ackResponse) => {
      const currentNameSpace = nameSpaces.find((ns) => {
        return ns.endPoint === roomObject.endPoint;
      });

      const currentRoom = currentNameSpace.rooms.find((room) => {
        return room.name === roomObject.roomName;
      });

      const { history } = currentRoom || { history: [] };

      let i = 0;
      const { rooms } = socket;

      rooms.forEach((room) => {
        if (i !== 0) {
          socket.leave(room);
        }
        i++;
      });

      socket.join(roomObject.roomName);

      const sockets = await io
        .of(nameSpace.endPoint)
        .in(roomObject.roomName)
        .fetchSockets();

      const socketCount = sockets.length;

      ackResponse({
        usersCount: socketCount,
        roomHistory: history,
      });
    });

    socket.on("newMessageToRoom", (messageObject) => {
      const currentRoom = [...socket.rooms][1];
      io.of(nameSpace.endPoint)
        .in(currentRoom)
        .emit("messageToRoom", messageObject);

      const currentNameSpace = nameSpaces[messageObject.selectedNameSpaceId];
      const actualRoom = currentNameSpace.rooms.find(
        (room) => room.name === currentRoom
      );
      actualRoom.addMessage(messageObject);
    });

    socket.on("disconnect", () => {
      // console.log(${socket.id} has disconnected from ${nameSpace.endPoint});
    });
  });
});
