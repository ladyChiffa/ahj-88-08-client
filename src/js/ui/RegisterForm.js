import RegisterAPI from "../api/RegisterAPI";

export default class RegisterForm {
    constructor(container, onSuccess) {
        this.container = container;
        this.onSuccess = onSuccess;

        this.form = document.createElement('div');
        this.form.classList.add('modal__content');
        this.form.classList.add('modal__body');
        this.form.innerHTML = `<div class="modal__header">Выберите псевдоним</div>
                                <div class="form">
                                    <input class="form__input" name="alias">
                                </div>
                                <div class="modal__footer">
                                    <button class="modal__ok">Продолжить</button>
                                </div>`;

        const registerButton = this.form.querySelector('.modal__ok');
        registerButton.addEventListener('click', this.handleSubmit.bind(this));

        this.registerAlias = this.form.querySelector('.form__input');
        this.registerAlias.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const clickEvent = new Event('click');
                registerButton.dispatchEvent(clickEvent);
            }
        })
        
        this.container.appendChild(this.form);

    }

    async handleSubmit (event) {
            event.preventDefault();

            const api = new RegisterAPI();
            const result = await api.register(this.registerAlias.value);

            if (result.status == 'error') {
                // в форме добавить инфо и очистить value
                const failedName = this.registerAlias.value;
                this.registerAlias.value = '';
                if (!this.errorMessageArea) {
                    this.errorMessageArea = document.createElement('div');
                    this.errorMessageArea.classList.add('error-message');
                }
                this.errorMessageArea.innerText = result.message + ': ' + failedName;
                this.registerAlias.insertAdjacentElement('afterend', this.errorMessageArea);
            }
            else {
                // закрыть форму и вернуть в приложение информацию о пользователе
                this.form.remove();
                this.onSuccess(result.user);
            }
    }
}