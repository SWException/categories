import { APIGatewayProxyHandler } from 'aws-lambda';
import response from 'src/handlers/apiResponses';
import Model from "../core/model"

export const HANDLER: APIGatewayProxyHandler = async () => {
    const MODEL: Model = Model.createModel();
    return await MODEL.getCategories()
        .then((result: Array<any>) => 
            result ? response(200, "success", result) : response(400, "no categories"))
        .catch((err: Error) => response(400, err.message));
}