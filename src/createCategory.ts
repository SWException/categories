import { APIGatewayProxyHandler } from 'aws-lambda';
import Category from 'src/types/Category';
import fetch from 'node-fetch';
import API_RESPONSES from "src/utils/apiResponses"

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    //console.log("event", event);

    /* const TOKEN = getTokenFromEvent(event);
    
    else {
        const USER: User = await User.createUser(TOKEN);
        if (!(USER && USER.isAuthenticate() && USER.isAdmin())) {
            return API_RESPONSES._400(null,
                "error", "TOKEN non valido o scaduto");
        }
    }
     */
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
                return API_RESPONSES._200(null);
            else
                return API_RESPONSES._400(null);
                                  
        })
        .catch((error) => {
            return API_RESPONSES._400(null,"error", error.message);
        });
}