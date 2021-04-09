  
import Category from "src/core/Category";
import { Persistence } from "./persistence";

export class DbMock implements Persistence {
    private static readonly CATEGORY1 = new Category("1", "tech");
    private static readonly CATEGORY2 = new Category("2", "food & beverage");
    private static readonly CATEGORY3 = new Category("3", "gardening");

    public async getAll (): Promise<Array<Category>> {
        return [DbMock.CATEGORY1, DbMock.CATEGORY2, DbMock.CATEGORY3];
    }
    public async getItem (id: string): Promise<Category> {
        return id ? DbMock.CATEGORY1 : null;
    }
    public async addItem (item: Category): Promise<boolean> {
        return item && item.getId() && item.getName ? true : null;
    }
    public async editItem (item: Category): Promise<boolean> {
        return item && item.getId() && item.getName  ? true : null;
    }
    public async deleteItem (id: string): Promise<boolean> {
        return id ? true : null;
    }

}