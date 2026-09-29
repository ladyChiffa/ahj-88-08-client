import {userStorage, messageStorage} from "../repo/Repo";

export default class ChatWidget {
    constructor(container, onSend) {
        this.container = container;
        this.onSend = onSend;

        this.chatWidget = document.createElement('div');
        this.chatWidget.classList.add('chat__container');
        this.chatWidget.classList.add('container');

        this.chatHeader = document.createElement('div');
        this.chatHeader.classList.add('chat__header');

        this.messagesArea = document.createElement('div');
        this.messagesArea.classList.add('chat__messages-container');

        this.inputMessage = document.createElement('input');
        this.inputMessage.classList.add('chat__messages-input');
        this.inputMessage.placeholder = 'Type your message here, then enter';
        this.inputMessage.addEventListener('keydown', this.sendMessage.bind(this));

        this.chatWidget.appendChild(this.chatHeader);
        this.chatWidget.appendChild(this.messagesArea);
        this.chatWidget.appendChild(this.inputMessage);


        this.opened = false;
        this.userId = null;
    }
    open (userId) {
        this.userId = userId;
        this.user = userStorage.onlineUsers.find(user => user.id == userId);

        this.chatHeader.innerText = this.user.name;
        this.messagesArea.innerHTML = '';

        if(!this.opened) {
            this.container.appendChild(this.chatWidget);
            this.opened = !this.opened;
        }
    }

    render(newMessage) {
        // нужно ли отображать в текущем открытом окне?
        if(newMessage.fromUser.id != this.userId && newMessage.toUser.id != this.userId) return;


        let userName;
        let messageClass;
        const timestamp = new Date().toLocaleString('ru-RU');
        if (newMessage.fromUser.id == userStorage.currentUser.id) {
            userName = 'You';
            messageClass = 'message__container-yourself';
        } 
        else {
            userName = newMessage.fromUser.name;
            messageClass = 'message__container-interlocutor';
        }
        
        
        const message = document.createElement('div');
        message.classList.add('message__container');
        message.innerHTML = `
            <div class='message__header'>${userName} ${timestamp}</div>
            <div >${newMessage.message}</div>
        `;
        message.classList.add(messageClass);
        
        this.messagesArea.appendChild(message);
    }

    sendMessage(e) {
        if (e.key !== 'Enter') return;

        const message = this.inputMessage.value.trim();
        if(!message) return;

        this.inputMessage.value = '';
        this.onSend(message, this.userId);
    }
}
