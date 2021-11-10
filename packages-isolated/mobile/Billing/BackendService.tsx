import {Platform} from "react-native";

export class BackendService {

    static async validateReceiptOnServer(transactionReceipt: string, email: string, OS: "android" | "ios" | "windows" | "macos" | "web") {
        const url = Platform.OS === 'android' ? 'https://ql77r00mvi.execute-api.us-east-1.amazonaws.com/prod/billing/google/verify-receipt' : 'https://ql77r00mvi.execute-api.us-east-1.amazonaws.com/prod/billing/apple/verify-receipt';

        console.log(`Validating receipt with ${url}`);

        const result = await fetch(url, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                receipt: transactionReceipt,
                email: email,
            })
        });

        if (result.ok) {
            return await result.json();
        }

        console.error('Failed to validate transaction in our Cloud Function');
        console.log(result.ok);
        console.log(await result.json());
        console.log(result.status);
        console.log(result.statusText);

        return false;
    }
}
