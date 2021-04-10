  
import { APIGatewayProxyResult } from "aws-lambda";

export default function response (statusCode: number, 
    message?: string,
    data?: JSON): APIGatewayProxyResult {
    const BODY = {
        status: (statusCode >= 400? "error" : "success")
    };
    if(message)
        BODY["message"] = message;
    if(data)
        BODY["data"] = data;
    
    return {
        "statusCode": statusCode,
        "body": JSON.stringify(BODY)
    }
}