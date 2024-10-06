class Room {
  constructor(id, name, nameSpaceId, privateRoom = false) {
    this.id = id;
    this.name = name;
    this.nameSpaceId = nameSpaceId;
    this.privateRoom = privateRoom;
    this.history = [];
  }

  addMessage(message) {
    if (this.history.length === 1000) {
      this.history.splice(0, 1);
    }
    this.history.push(message);
  }

  clearHistory() {
    this.history = [];
  }
}

module.exports = Room;
