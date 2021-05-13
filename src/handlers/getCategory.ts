import { APIGatewayProxyHandler } from 'aws-lambda';
import response from "src/handlers/apiResponses";
import Model from "../core/model"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const CATEGORY_ID: string = event.pathParameters?.id;
    if(CATEGORY_ID == null)
        return response(400, "request error");
    const MODEL: Model = Model.createModel();
    return await MODEL.getCategory(CATEGORY_ID)
        .then((category: any) => 
            category ? response(200, "success", category) : response(400, "error"))
        .catch((err: Error) => response(400, err.message));
}
