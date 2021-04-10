  
import { APIGatewayProxyHandler } from 'aws-lambda';
import response from "src/handlers/apiResponses";
import Model from "../core/model"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const CATEGORY_ID: string = event.pathParameters?.id;
    if(CATEGORY_ID == null)
        return response(400, "request error");
    const MODEL: Model = Model.createModel();
    const CATEGORY: JSON = await MODEL.getCategory(CATEGORY_ID);
    return CATEGORY ? response(200, "success", CATEGORY) : response(400, "error");
}
