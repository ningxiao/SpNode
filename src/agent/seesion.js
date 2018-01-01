const store = {};
module.exports = (key, value = "") => {
    if (value) {
        store[key] = value;
    } else {
        if (key in store) {
            value = store[key];
        }
    }
    return value;
};