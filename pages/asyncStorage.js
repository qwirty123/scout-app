import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, value) => {
    try {
        console.log("Storing data", key)
        await AsyncStorage.setItem(key, value)
    } catch (e) {
        throw e
        // saving error
    }
}

export const getData = async (key, callback) => {
    try {
        console.log("Getting data", key)
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            callback(value)
        }
    } catch(e) {
        throw e
        // error reading value
    }
}

