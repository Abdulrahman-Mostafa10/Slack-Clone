const buildMessage = (messageObject) => {
  return `
    <li>
      <div class="user-image">
        <img src=${messageObject.avatar} alt="User Image" />
      </div>
      <div class="user-message">
        <div class="user-name-time">
          ${messageObject.userName} <span>${messageObject.date}</span>
        </div>
        <div class="message-text">${messageObject.message}</div>
      </div>
    </li>
    `;
};
