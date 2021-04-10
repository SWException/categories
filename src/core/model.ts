import { Persistence } from "../repository/persistence"
import { Dynamo } from "../repository/dynamo"
import { DbMock } from "../repository/dbMock";
import { v4 as uuidv4 } from 'uuid';
import { Users } from "src/repository/users";
import { UsersService } from "src/repository/usersService";
import { UsersMock } from "src/repository/usersMock";
import Category from "./Category";

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
            const CATEGORY = new Category(uuidv4(), name);
            result = await this.DATABASE.addItem(CATEGORY);
        }
        return result;
    }

    public async getCategories (): Promise<JSON> {
        const CATEGORIES: Array<Category> = await this.DATABASE.getAll();
        if(CATEGORIES == null)
            return null;
        
        return JSON.parse(JSON.stringify(CATEGORIES));
    }

    public async getCategory (id: string): Promise<JSON> {
        const CATEGORY: Category = await this.DATABASE.getItem(id);
        return CATEGORY ? JSON.parse(JSON.stringify(CATEGORY)) : null;
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