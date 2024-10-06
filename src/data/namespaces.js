const Room = require("../classes/room");
const NameSpace = require("../classes/namespace");

const wikiNs = new NameSpace(
  0,
  "wiki",
  "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png"
);

const mozillaNs = new NameSpace(
  1,
  "mozilla",
  "https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png"
);

const linuxNs = new NameSpace(
  2,
  "linux",
  "https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png"
);

wikiNs.addRoom(new Room(0, "New Articles", 0, 1));
wikiNs.addRoom(new Room(1, "Editors", 0));
wikiNs.addRoom(new Room(2, "Others", 0));

mozillaNs.addRoom(new Room(0, "FireFox", 1));
mozillaNs.addRoom(new Room(1, "Sea Monkey", 1));
mozillaNs.addRoom(new Room(2, "Spider Monkey", 1));
mozillaNs.addRoom(new Room(3, "Rust", 1));

linuxNs.addRoom(new Room(0, "Debian", 2));
linuxNs.addRoom(new Room(1, "Red-Hat", 2));
linuxNs.addRoom(new Room(2, "Ubuntu", 2));
linuxNs.addRoom(new Room(3, "Mac OS", 2));

const namespaces = [wikiNs, mozillaNs, linuxNs];

module.exports = namespaces;