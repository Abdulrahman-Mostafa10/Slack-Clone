const joinNameSpace = (element, nameSpaces) => {
  const clickedEndPoint = element.getAttribute("ns");
  const clickedNameSpace = nameSpaces.find(
    (ns) => ns.endPoint === clickedEndPoint
  );
  selectedNameSpaceId = clickedNameSpace.id;
  selectedNameSpaceEndPoint = clickedEndPoint;

  if (!clickedNameSpace) {
    console.error("Namespace not found");
    return;
  }

  const { rooms } = clickedNameSpace;
  const roomsList = document.querySelector(".room-list");

  if (!roomsList) {
    console.error("Room list element not found");
    return;
  }

  roomsList.innerHTML = "";

  if (rooms.length === 0) {
    roomsList.innerHTML = "<li>No rooms available</li>";
    return;
  }

  let firstRoom;
  rooms.forEach((room, i) => {
    if (i === 0) {
      firstRoom = room.name;
    }
    roomsList.appendChild(createRoomElement(room));
  });

  joinRoom(firstRoom, clickedEndPoint);

  const roomNodes = document.querySelectorAll(".room");
  Array.from(roomNodes).forEach((elem) => {
    elem.addEventListener("click", (event) => {
      const nameSpaceId = elem.getAttribute("nameSpaceId"),
        nameSpaceEndPoint = nameSpaces.find((ns) => {
          return ns.id == nameSpaceId;
        }).endPoint;

      joinRoom(event.target.innerText, nameSpaceEndPoint);
    });
  });

  localStorage.setItem("lastNameSpaceEndPoint", clickedEndPoint);
};

const createRoomElement = (room) => {
  const li = document.createElement("li");
  li.innerHTML = `<li class= 'room' nameSpaceId=${
    room.nameSpaceId
  }><span class="fa-solid fa-${room.privateRoom ? "lock" : "globe"}"></span>${
    room.name
  }</li>`;

  return li;
};
