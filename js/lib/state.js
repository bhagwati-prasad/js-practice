
class StorageDriver {
    constructor(type, options = {}) {
        this.type = type;
        this.options = options;

        if (type === 'remote') {
            if (!options.url) {
                throw new Error('Remote storage requires a URL');
            }
            this.url = options.url;
        }
    }

    async set(key, value) {
        const data = JSON.stringify(value);

        switch (this.type) {
            case 'local':
                localStorage.setItem(key, data);
                return Promise.resolve({ success: true, key, value });

            case 'session':
                sessionStorage.setItem(key, data);
                return Promise.resolve({ success: true, key, value });

            case 'remote':
                const response = await fetch(`${this.url}/${key}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: data
                });
                return response.json();

            default:
                throw new Error(`Unsupported storage type: ${this.type}`);
        }
    }

    async get(key) {
        switch (this.type) {
            case 'local':
                const localData = localStorage.getItem(key);
                return Promise.resolve(localData ? JSON.parse(localData) : null);

            case 'session':
                const sessionData = sessionStorage.getItem(key);
                return Promise.resolve(sessionData ? JSON.parse(sessionData) : null);

            case 'remote':
                const response = await fetch(`${this.url}/${key}`);
                if (!response.ok) {
                    return null;
                }
                return response.json();

            default:
                throw new Error(`Unsupported storage type: ${this.type}`);
        }
    }

    async delete(key) {
        switch (this.type) {
            case 'local':
                localStorage.removeItem(key);
                return Promise.resolve({ success: true, key });

            case 'session':
                sessionStorage.removeItem(key);
                return Promise.resolve({ success: true, key });

            case 'remote':
                const response = await fetch(`${this.url}/${key}`, {
                    method: 'DELETE'
                });
                return response.json();

            default:
                throw new Error(`Unsupported storage type: ${this.type}`);
        }
    }

    async exists(key) {
        const value = await this.get(key);
        return value !== null;
    }

    async clear() {
        switch (this.type) {
            case 'local':
                localStorage.clear();
                return Promise.resolve({ success: true });

            case 'session':
                sessionStorage.clear();
                return Promise.resolve({ success: true });

            case 'remote':
                throw new Error('Clear operation not supported for remote storage');

            default:
                throw new Error(`Unsupported storage type: ${this.type}`);
        }
    }
}

export default StorageDriver;