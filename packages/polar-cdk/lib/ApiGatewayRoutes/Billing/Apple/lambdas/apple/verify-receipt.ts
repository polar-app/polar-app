import {verifyReceipt} from "./util/verify-receipt";
import {linkEmailToReceipt} from "./util/link-email-to-receipt";
import {APIGatewayProxyHandler} from "aws-lambda";

export const handler: APIGatewayProxyHandler = async (event) => {
    console.log(event);

    const request: {
        readonly email: string,
        readonly receipt: string,
    } = JSON.parse(event.body || '{}');

    const email = request.email;
    const receipt = request.receipt;

    if (!email || !receipt) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Email and receipt are required",
            })
        }
    }

    const appleVerifyReceiptResponse = await verifyReceipt(receipt);

    if (appleVerifyReceiptResponse.status !== 0) {
        console.error(`Apple verifyReceipt call failed with an error code: ${appleVerifyReceiptResponse.status}`);
        console.error('See https://developer.apple.com/documentation/appstorereceipts/status');

        return {
            statusCode: 400,
            body: JSON.stringify({
                message: `Verify receipt failed with an error code: ${appleVerifyReceiptResponse.status}`,
            })
        }
    }
    if (!appleVerifyReceiptResponse.receipt || !appleVerifyReceiptResponse.latest_receipt_info.length) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Failed to validate the receipt with Apple',
            })
        }
    }

    await linkEmailToReceipt(email, appleVerifyReceiptResponse);

    return {
        statusCode: 200,
        body: JSON.stringify({success: true})
    }

}
