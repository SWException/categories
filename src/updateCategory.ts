import { APIGatewayProxyHandler } from 'aws-lambda';
import Category from 'src/types/Category';
import User from 'src/types/User';
import API_RESPONSES from "src/utils/apiResponses"

 export const HANDLER: APIGatewayProxyHandler = async (event) => {
    //console.log("event", event);

    const TOKEN = event.headers?.Authorization;
    if (TOKEN == null) {
        return API_RESPONSES._400(null, "error", "manca TOKEN");
    }
    else {
        const USER: User = await User.createUser(TOKEN);
        if (!(USER && USER.isAuthenticate() && USER.isAdmin())) {
            return API_RESPONSES._400(null,
                "error", "TOKEN non valido o scaduto");
        }
    }

    const DATA = JSON.parse(event?.body);
    const RES = await Category.updateCategory(DATA['id'], DATA);

    console.log(JSON.stringify(RES));

    return API_RESPONSES._200(RES);
}
