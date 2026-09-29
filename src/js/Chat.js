import config from '../config/config.json';
import ChatAPI from "./api/ChatAPI";
import RegisterForm from "./ui/RegisterForm";
import UsersWidget from "./ui/UsersWidget";
import ChatWidget from "./ui/ChatWidget";
import {userStorage, messageStorage} from "./repo/Repo";

export default class Chat {
  constructor(container) {
    this.container = container;
    this.api = new ChatAPI();
    this.websocket = null;
  }

  init() {
    this.registerForm = new RegisterForm(this.container, this.onRegisterSuccess.bind(this));
    this.usersWidget = new UsersWidget(this.container, this.onSelectUser.bind(this));
    this.chatWidget = new ChatWidget(this.container, this.onSendMessage.bind(this));
  }

  onRegisterSuccess(userData) {
    userStorage.currentUser = userData;
    this.setupWS();
    this.usersWidget.open();
  }
  onSelectUser(userId) {
    this.chatWidget.open(userId);
  }
  onSendMessage(message, userId) {
    const user = userStorage.onlineUsers.find(user => user.id == userId);

    const messageObject = {
      type: 'send',
      message: message,
      toUser: user,
      fromUser: userStorage.currentUser
    };
    this.ws.send(JSON.stringify(messageObject));
  }

  setupWS() {
        this.ws = new WebSocket('wss://' + config.hostURI + '/ws');
        this.ws.addEventListener('open', (e) => {
            console.log(e);
            console.log('ws open');
        });
        this.ws.addEventListener('close', (e) => {
            console.log(e);
            console.log('ws close');
        });
        this.ws.addEventListener('error', (e) => {
            console.log(e);
            console.log('ws error');
        });
        this.ws.addEventListener('message', this.processMessage.bind(this));


        window.addEventListener('beforeunload', () => {
              this.ws.send(JSON.stringify(
                  { 
                    type: 'exit', 
                    user: userStorage.currentUser 
                  }
                ));
        });        
  }

  processMessage(e) {
      console.log(e);
      const data = JSON.parse(e.data);
      
      if (Array.isArray(data)) {
        const onlineUsers = data.filter(user => user.name && user.id != userStorage.currentUser.id);
        userStorage.onlineUsers = onlineUsers;
        this.usersWidget.render(onlineUsers);
      }
      else if (data.type == 'send') {
        messageStorage.add(data);
        this.chatWidget.render(data);
      }
      console.log('ws message');
  }

  bindToDOM() {}

  registerEvents() {}

  subscribeOnEvents() {}

  onEnterChatHandler() {}

  sendMessage() {}

  renderMessage() {}
}
