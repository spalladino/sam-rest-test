"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function handler(event, context) {
    console.log(`Called relayer-api lambda handler with:\n${JSON.stringify(event)}\n${JSON.stringify(context)}`);
    return {
        'statusCode': 200,
        'body': JSON.stringify({ hello: 'world' })
    };
}
exports.handler = handler;
;
//# sourceMappingURL=index.js.map