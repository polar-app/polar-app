import * as React from "react";
import {JSONRPC} from "../../datastore/sharing/rpc/JSONRPC";

interface RpcDemoRequest {
    email: string,
}

interface RpcDemoResponse {
    [key: string]: unknown,
}

export function CDKDemo() {
    const [result, setResult] = React.useState<any | undefined>(undefined);

    React.useEffect(() => {
        const request: RpcDemoRequest = {
            email: 'example@example.com',
        };

        JSONRPC.exec<RpcDemoRequest, RpcDemoResponse>('rpc-sample', request)
            .then(result => {
                setResult(result);
            })
            .catch(reason => console.error(reason));
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
