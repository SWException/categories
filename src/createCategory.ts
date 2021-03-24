import { APIGatewayProxyHandler } from 'aws-lambda';
import Category from 'src/types/Category';
import User from 'src/types/User';
import API_RESPONSES from "src/utils/apiResponses"
import { getTokenFromEvent, getBodyDataFromEvent } from "src/utils/checkJWT";

export const HANDLER: APIGatewayProxyHandler = async (event) => {
    //console.log("event", event);

    const TOKEN = getTokenFromEvent(event);
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

    const DATA = getBodyDataFromEvent(event);
    const RES: boolean = await Category.createNewCategory(DATA);

    console.log(JSON.stringify(RES));

    if (RES)
        return API_RESPONSES._200(null);
    else
        return API_RESPONSES._400(null);
}
