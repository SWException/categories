import { APIGatewayProxyHandler } from 'aws-lambda';
import response from 'src/handlers/apiResponses';
import Model from "../core/model"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const MODEL: Model = Model.createModel();

    const SEARCH = event.queryStringParameters?.search;

    return await MODEL.getCategories(SEARCH)
        .then((result: Array<any>) => 
            result ? response(200, "success", result) : response(400, "no categories"))
        .catch((err: Error) => response(400, err.message));
}