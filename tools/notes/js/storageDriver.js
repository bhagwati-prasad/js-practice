const StorageDriver = (function() {
    let currentDriver = 'localStorage';

    const drivers = {
        localStorage: {
            save: function(key, value) {
                try {
                    localStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (e) {
                    console.error(e);
                    return false;
                }
            },
            load: function(key) {
                try {
                    const data = localStorage.getItem(key);
                    return data ? JSON.parse(data) : null;
                } catch (e) {
                    console.error(e);
                    return null;
                }
            },
            remove: function(key) {
                try {
                    localStorage.removeItem(key);
                    return true;
                } catch (e) {
                    console.error(e);
                    return false;
                }
            },
            clear: function() {
                try {
                    localStorage.clear();
                    return true;
                } catch (e) {
                    console.error(e);
                    return false;
                }
            }
        },
        sessionStorage: {
            save: function(key, value) {
                try {
                    sessionStorage.setItem(key, JSON.stringify(value));
                    return true;
                } catch (e) {
                    console.error(e);
                    return false;
                }
            },
            load: function(key) {
                try {
                    const data = sessionStorage.getItem(key);
                    return data ? JSON.parse(data) : null;
                } catch (e) {
                    console.error(e);
                    return null;
                }
            },
            remove: function(key) {
                try {
                    sessionStorage.removeItem(key);
                    return true;
                } catch (e) {
                    console.error(e);
                    return false;
                }
            },
            clear: function() {
                try {
                    sessionStorage.clear();
                    return true;
                } catch (e) {
                    console.error(e);
                    return false;
                }
            }
        }
    };

    return {
        setDriver: function(driver) {
            if (drivers[driver]) {
                currentDriver = driver;
                return true;
            }
            return false;
        },
        getDriver: function() {
            return currentDriver;
        },
        save: function(key, value) {
            return drivers[currentDriver].save(key, value);
        },
        load: function(key) {
            return drivers[currentDriver].load(key);
        },
        remove: function(key) {
            return drivers[currentDriver].remove(key);
        },
        clear: function() {
            return drivers[currentDriver].clear();
        }
    };
})();