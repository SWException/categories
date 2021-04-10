import { APIGatewayProxyHandler } from 'aws-lambda';
import response from "src/handlers/apiResponses";
import Model from "../core/model"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const TOKEN: string = event.headers?.Authorization;
    const CATEGORY_ID: string = event.pathParameters?.id;
    if (TOKEN == null || CATEGORY_ID == null) {
        return response(400, "missing token");
    }
    const BODY = event.body;
    const MODEL: Model = Model.createModel();
    return await MODEL.updateCategory(TOKEN, CATEGORY_ID, BODY["categoryName"])
        .then((RESULT: boolean) => {
            return RESULT ? response(200, "update successful") : response(400, "update failure");
        })
        .catch((err: Error) => response(400, err.message));
}