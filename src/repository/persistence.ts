import Category from "src/core/Category";

export interface Persistence {
    getAll(): Promise<Array<Category>>;
    getItem(id: string): Promise<Category>;
    addItem(item: Category): Promise<boolean>;
    editItem(item: Category): Promise<boolean>;
    deleteItem(id: string): Promise<boolean>;
}