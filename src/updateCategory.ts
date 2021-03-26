import { APIGatewayProxyHandler } from 'aws-lambda';
import Category from 'src/types/Category';
import API_RESPONSES from "src/utils/apiResponses"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    
    return await fetch(`https://95kq9eggu9.execute-api.eu-central-1.amazonaws.com/dev/users/check/${TOKEN}`)
        .then(response => response.json())
        .then( data => {
            if (data.status!="success")
                throw new Error(data.message);
            if (data.username!="vendor")
                throw new Error("Only a vendor can edit a category");  
            const DATA = JSON.parse(event?.body);
            const RES: Promise<boolean>= Category.updateCategory(DATA['id'], DATA);
            console.log(JSON.stringify(RES));
            
            if (RES)
                return API_RESPONSES._200(null, null, "category edited correctly");
            else
                return API_RESPONSES._400(null,null, "the category couldn't be modified");
                                  
        })
        .catch((error) => {
            return API_RESPONSES._400(null,"error", error.message);
        });
}
