import { Persistence } from "../repository/persistence";
import { DbMock } from "../repository/dbMock";
import { v4 as uuidv4 } from 'uuid';
import { Users } from "src/repository/users";
import { UsersService } from "src/repository/usersService";
import { UsersMock } from "src/repository/usersMock";
import Category from "./Category";
import { Dynamo } from "src/repository/dynamo";

export default class Model {
    private readonly DATABASE: Persistence;
    private readonly USERS: Users;
    
    private constructor (db: Persistence, users: Users) {
        this.DATABASE = db;
        this.USERS = users;
    }

    public static createModel (): Model {
        return new Model(new Dynamo(), new UsersService());
    }

    public static createModelMock (): Model {
        return new Model(new DbMock(), new UsersMock());
    }

    public async createCategory (name: string, token: string): Promise<boolean> {
        const IS_VENDOR = await this.USERS.checkVendor(token);
        if (!IS_VENDOR){
            throw new Error("invalid token");
        }
        let result = false;
        if(name && name.length > 0) {
            console.log("Vado ad aggiungere");
            
            const CATEGORY = new Category(uuidv4(), name);
            console.log("CATEGORY", CATEGORY);
            
            result = await this.DATABASE.addItem(CATEGORY);
        }
        return result;
    }

    public async getCategories (): Promise<Array<Category>> {
        return await this.DATABASE.getAll();
    }

    public async getCategory (id: string): Promise<Category> {
        return await this.DATABASE.getItem(id);
    }

    public async deleteCategory (id: string, token: string): Promise<boolean> {
        const IS_VENDOR = await this.USERS.checkVendor(token);
        if (!IS_VENDOR){
            throw new Error("invalid token");
        }
        if(!id){
            return false;
        }
        return await this.DATABASE.deleteItem(id);
    }

    public async updateCategory (token: string, id: string, name: string): Promise<boolean> {
        const IS_VENDOR = await this.USERS.checkVendor(token);
        if (!IS_VENDOR){
            throw new Error("invalid token");
        }
        if(name == null ) {
            return false;
        }
        return this.DATABASE.editItem(new Category(id, name));
    }
}