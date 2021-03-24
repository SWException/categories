import { APIGatewayProxyHandler } from 'aws-lambda';
import Category from 'src/types/Category';
import API_RESPONSES from "src/utils/apiResponses"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    return API_RESPONSES._200(await Category.buildAllCategories());
}
