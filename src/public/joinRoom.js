const joinRoom = async (roomName, endPoint) => {
  console.log(roomName + " " + endPoint);
  const ackResponse = await connectedSockets[endPoint].emitWithAck("joinRoom", {
    roomName,
    endPoint,
  });

  console.log(ackResponse.usersCount, ackResponse.roomHistory);

  document.querySelector(".curr-room-num-users").innerHTML = `
    ${ackResponse.usersCount} <span class="fa-solid fa-user"></span>`;

  document.querySelector(".curr-room-text").innerHTML = roomName;

  document.querySelector("#messages").innerHTML = "";
  console.log(ackResponse.roomHistory);
  ackResponse.roomHistory.forEach((message) => {
    document.querySelector("#messages").innerHTML += buildMessage(message);
  });
};
