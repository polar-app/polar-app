import * as React from "react";
import {JSONRPC} from "../../datastore/sharing/rpc/JSONRPC";

interface RpcDemoRequest {
    readonly email: string,
    readonly tag?: string,
}

interface RpcDemoResponse {
    readonly [key: string]: unknown,
}

export function CDKDemo() {
    const [result, setResult] = React.useState<any | undefined>(undefined);

    React.useEffect(() => {
        const request: RpcDemoRequest = {
            email: 'example@example.com',
            tag: "initial_signup",
        };

        JSONRPC.exec<RpcDemoRequest, RpcDemoResponse>('test', request)
            .then(result => {
                setResult(result);
            })
            .catch(reason => console.error(reason));

        // JSONRPC.exec<RpcDemoRequest, RpcDemoResponse>('private-beta/register', request)
        //     .then(result => {
        //         setResult(result);
        //     })
        //     .catch(reason => console.error(reason));
    }, []);

    return <>
        <div style={{
            flex: '100%',
        }}>
            <p>Result from AWS API Gateway call:</p>
            <pre>
                {JSON.stringify(result, null, 2)}
            </pre>
        </div>
    </>;
}
