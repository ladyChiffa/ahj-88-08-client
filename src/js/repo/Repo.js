export const userStorage = {
    onlineUsers : [],
    currentUser: {}
};

export const messageStorage = {
    data: [],
    add : function (message){
        message.timestamp = new Date().toLocaleString('ru-RU');
        this.data.push(message);
    }
};
