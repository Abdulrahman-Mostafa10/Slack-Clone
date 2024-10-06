let selectedNameSpaceId = 0;
let selectedNameSpaceEndPoint = "";
let connectedSockets = {};
let listeners = {
  updateNameSpace: {},
  connection: {},
  messageToRoom: {},
};
let enrolledUser;

const URI = "http://localhost:3000";
const socket = io(URI);

document.querySelector("#message-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.querySelector("#user-message").value;

  connectedSockets[selectedNameSpaceEndPoint].emit("newMessageToRoom", {
    message,
    date: new Date(Date.now()).toLocaleString(),
    avatar: "https://via.placeholder.com/30",
    userName: enrolledUser,
    selectedNameSpaceId,
  });

  document.querySelector("#user-message").value = "";
});

const addListener = (endPoint, event, callback, listenerType) => {
  if (!listeners[listenerType]) {
    listeners[listenerType] = {};
  }
  if (!listeners[listenerType][endPoint]) {
    connectedSockets[endPoint].on(event, callback);
    listeners[listenerType][endPoint] = true;
  }
};

const addListeners = (endPoint) => {
  addListener(
    endPoint,
    "update-namespace",
    (data) => {
      console.log("Namespace has changed!");
      console.log(data);
    },
    "updateNameSpace"
  );

  addListener(
    endPoint,
    "connect",
    () => {
      console.log(`${endPoint} is connected`);
    },
    "connection"
  );

  addListener(
    endPoint,
    "messageToRoom",
    (messageObject) => {
      console.log(messageObject);
      document.querySelector("#messages").innerHTML +=
        buildMessage(messageObject);
    },
    "messageToRoom"
  );
};

const renderNameSpaces = (nameSpaces) => {
  const nameSpacesDiv = document.querySelector(".namespaces");
  nameSpacesDiv.innerHTML = "";

  nameSpaces.forEach((nameSpace) => {
    const namespaceElement = document.createElement("div");
    namespaceElement.classList.add("namespace");
    namespaceElement.setAttribute("ns", nameSpace.endPoint);

    namespaceElement.innerHTML = `
      <img src="${nameSpace.imageUrl}" alt="${nameSpace.name}" />`;

    nameSpacesDiv.appendChild(namespaceElement);

    if (!connectedSockets[nameSpace.endPoint]) {
      connectedSockets[nameSpace.endPoint] = io(URI + nameSpace.endPoint);
    }
    addListeners(nameSpace.endPoint);

    namespaceElement.addEventListener("click", () => {
      joinNameSpace(namespaceElement, nameSpaces);
    });
  });
};

const initializeLastNamespace = (nameSpaces) => {
  const lastNameSpaceEndPoint = localStorage.getItem("lastNameSpaceEndPoint");

  if (lastNameSpaceEndPoint) {
    const lastIndex = Array.from(
      document.getElementsByClassName("namespace")
    ).findIndex((element) => {
      return element.getAttribute("ns") === lastNameSpaceEndPoint;
    });

    if (lastIndex !== -1) {
      joinNameSpace(
        document.getElementsByClassName("namespace")[lastIndex],
        nameSpaces
      );
    }
  } else {
    joinNameSpace(document.getElementsByClassName("namespace")[0], nameSpaces);
  }
};

socket.on("connect", () => {
  console.log("Connected !!");
  socket.emit("clientConnect");
});

socket.on("welcome", (data) => {
  console.log(data.greeting);
  enrolledUser = data.currentUser;
});

socket.on("namespaces-list", (nameSpaces) => {
  renderNameSpaces(nameSpaces);
  initializeLastNamespace(nameSpaces);
});
