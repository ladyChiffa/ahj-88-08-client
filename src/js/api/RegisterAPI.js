import config from '../../config/config.json';

export default class RegisterAPI {
  async register(username) {
        const user = { name: username };

        const request = fetch (config.hostProtocol + "://" + config.hostURI + '/new-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const result = await request;

        try {
            const json = await result.json();
            return json;
        }
        catch(e) {
            return {status: 'error', message: 'Internal error, please try later: ' + e};
        }
  }
}
