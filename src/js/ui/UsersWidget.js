import {userStorage, messageStorage} from "../repo/Repo";

export default class UsersWidget {
    constructor(container, onSelect) {
        this.container = container;
        this.onSelect = onSelect;

        this.usersWidget = document.createElement('div');
        this.usersWidget.classList.add('chat__userlist');
        this.usersWidget.classList.add('container');
        this.usersWidget.addEventListener('click', this.openUserChat.bind(this));
    }
    open () {
        this.container.appendChild(this.usersWidget);
    }

    render(data) {
        this.usersWidget.innerHTML = '';
        data.forEach(user => this.renderUser(user));
    }

    renderUser(user) {
        const userElement = document.createElement('div');
        userElement.classList.add('chat__user');
        userElement.dataset.id = user.id;

        if(user.id == userStorage.currentUser.id) {
            userElement.innerText = 'You (' + user.name + ')';
            userElement.classList.add('chat__user-self');
        }
        else {
            userElement.innerText = user.name;
        }
        this.usersWidget.appendChild(userElement);
    }

    openUserChat(e) {
        const user = e.target.closest('.chat__user');
        if (user && user.dataset) {
            this.onSelect(user.dataset.id);
        }
    }
}
