  
import fetch from "node-fetch";
import { Users } from "./users";

export class UsersService implements Users {

    public async checkVendor(token: string): Promise<boolean> {
        return await fetch(process.env.SERVICES + `/users/vendors/check/${token}`)
            .then(async responseUser => {
                return responseUser.status == 200;
            })
            .catch(error => {
                return error.message;
            })
    }

}