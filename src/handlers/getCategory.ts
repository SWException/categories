import { APIGatewayProxyHandler } from 'aws-lambda';
import Category from 'src/core/Category';
import API_RESPONSES from "src/core/utils/apiResponses"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    const CATEGORY_ID = event.pathParameters?.id;

    const CATEGORY: Category = await Category.buildCategory(CATEGORY_ID);

    console.log(JSON.stringify(CATEGORY));

    if (CATEGORY) {
        return API_RESPONSES._200(CATEGORY.getJson());
    }
    else {
        return API_RESPONSES._400(null, "error", "categoria non presente");
    }
}
