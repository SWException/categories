import { APIGatewayProxyHandler } from 'aws-lambda';
import Category from 'src/core/Category';
import fetch from 'node-fetch';
import API_RESPONSES from "src/core/utils/apiResponses"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    
    const TOKEN= event.headers?.Authorization;
    if (TOKEN == null) {
        return API_RESPONSES._400(null, "error", "manca TOKEN");
    }
    return await fetch(`https://95kq9eggu9.execute-api.eu-central-1.amazonaws.com/dev/users/check/${TOKEN}`)
        .then(response => response.json())
        .then( data => {
            if (data.status!="success")
                throw new Error(data.message);
            if (data.username!="vendor")
                throw new Error("Only a vendor can remove a category");  
            const DATA = JSON.parse(event?.body);
            const RES: Promise<boolean> = Category.createNewCategory(DATA);
            console.log(JSON.stringify(RES));
            if (RES)
                return API_RESPONSES._200(null, null, "category added");
            else
                return API_RESPONSES._400(null, null, "error while inserting the new category");
                                  
        })
        .catch((error) => {
            return API_RESPONSES._400(null,"error", error.message);
        });
}