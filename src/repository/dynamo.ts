import * as AWS from "aws-sdk";
import Category from "src/core/Category"
import { Persistence } from "./persistence";

export class Dynamo implements Persistence {
    private static readonly TABLE_CATEGORIES = "categories";
    private DOCUMENT_CLIENT = new AWS.DynamoDB.DocumentClient({ region: "eu-central-1" });
    
    public async getAll (): Promise<Category[]> {
        const PARAMS = {
            TableName: Dynamo.TABLE_CATEGORIES
        };
    
        const DATA = await this.DOCUMENT_CLIENT
            .scan(PARAMS).promise()
            .catch((err) => console.log(err.message));
        console.log("Data from DB: " + JSON.stringify(DATA));
        return DATA ? DATA.Items as Category[] : null;
    }

    public async getItem (id: string): Promise<Category> {
        const PARAMS = {
            Key: {
                id: id
            },
            TableName: Dynamo.TABLE_CATEGORIES,
            IndexName: "id-index"
        };

        const DATA = await this.DOCUMENT_CLIENT.get(PARAMS).promise();
        return DATA.Item? new Category(DATA.Item.id, DATA.Item.category) : null;
    }

    public async addItem (item: Category): Promise<boolean> {
        const PARAMS = {
            TableName: Dynamo.TABLE_CATEGORIES,
            Key: {
                id: item.getId()
            },
            Item: item
        };
        const DATA =  this.DOCUMENT_CLIENT.put(PARAMS).promise().catch(
            () => {return false; });
        return (DATA) ? true : false;
    }

    public async editItem (item: Category): Promise<boolean> {
        const VALUES = {};
        let expression = "SET ";
        let first = true;

        Object.keys(item).forEach(function (key) {
            if (key != "id") {
                const VALUE = item[key];
                if (!first) {
                    expression += ", "
                } 
                else {
                    first = false;
                }
                expression += key + " = :" + key;
                VALUES[":" + key] = VALUE;
            }
        });

        const PARAMS = {
            TableName: Dynamo.TABLE_CATEGORIES,
            Key: {
                id: item.getId()
            },
            UpdateExpression: expression,
            ExpressionAttributeValues: VALUES
        }
        console.log(PARAMS);
        const DATA = await this.DOCUMENT_CLIENT.update(PARAMS).promise().catch(
            (err) => { return err; });
        return DATA;
    }

    public async deleteItem (id: string): Promise<boolean> {
        const PARAMS = {
            Key: {
                id: id
            },
            TableName: Dynamo.TABLE_CATEGORIES,
            IndexName: "id-index"
        };

        await this.DOCUMENT_CLIENT.delete(PARAMS).promise().catch(
            (err) => { return err; }
        );
        return true;     
    }
}
