import { Storage } from "redux-persist";
import { MMKV } from 'react-native-mmkv';

// Initialize MMKV storage
const storage = new MMKV();

// Optional: If you need encryption, configure it here
export const token_storage = new MMKV({
    id: "user-storage",
    encryptionKey: "RSA_KEY"
});

const reduxStorage: Storage = {
    setItem: (key: string, value: string) => {
        try {
            // Ensure value is of supported type
            if (typeof value === 'object') {
                // Serialize if it's an object
                storage.set(key, JSON.stringify(value));
            } else {
                // Directly store primitive types
                storage.set(key, value);
            }
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    },
    getItem: (key: string) => {
        try {
            const value = storage.getString(key);
            // Parse the value if it was stored as JSON
            if (value) {
                return Promise.resolve(value);
            }
            return Promise.resolve(null);
        } catch (error) {
            return Promise.reject(error);
        }
    },
    removeItem: (key: string) => {
        try {
            storage.delete(key);
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    },
};

export default reduxStorage;
