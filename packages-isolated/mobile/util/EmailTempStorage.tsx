import AsyncStorage from "@react-native-async-storage/async-storage";

export class EmailTempStorage {
    static async store(email: string) {
        try {
            await AsyncStorage.setItem(
                '@polar:buyer_email',
                email
            );
            return true;
        } catch (error) {
            console.error('Can not store buyer Email');
            console.error(error);
            return false;
        }
    }
}
