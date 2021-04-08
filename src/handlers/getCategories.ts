import { APIGatewayProxyHandler } from 'aws-lambda';
import Category from 'src/core/Category';
import API_RESPONSES from "src/core/utils/apiResponses"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    return API_RESPONSES._200(await Category.buildAllCategories());
}
