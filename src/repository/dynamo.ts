import * as AWS from "aws-sdk";
import Category from "src/core/Category"
import { Persistence } from "./persistence";

export class Dynamo implements Persistence {
    private static readonly TABLE_CATEGORIES = "categories";
    private DOCUMENT_CLIENT = new AWS.DynamoDB.DocumentClient({ region: "eu-central-1" });

    public async getAll(search?: string): Promise<Category[]> {
        const PARAMS = {
            TableName: Dynamo.TABLE_CATEGORIES,
        };

        if (search) {
            PARAMS['FilterExpression'] = "contains(#name, :search)";
            PARAMS['ExpressionAttributeValues'] = {
                ":search": search
            };
            PARAMS['ExpressionAttributeNames'] = {
                "#name": "name"
            }
        }

        const DATA = await this.DOCUMENT_CLIENT
            .scan(PARAMS).promise();

        console.log("Data from DB: " + JSON.stringify(DATA));
        return DATA ? DATA.Items as Category[] : null;
    }

    public async getItem(id: string): Promise<Category> {
        const PARAMS = {
            Key: {
                id: id
            },
            TableName: Dynamo.TABLE_CATEGORIES,
            IndexName: "id-index"
        };

        const DATA = await this.DOCUMENT_CLIENT.get(PARAMS).promise();
        return DATA.Item ? new Category(DATA.Item.id, DATA.Item.category) : null;
    }

    public async addItem(item: Category): Promise<boolean> {
        const PARAMS = {
            TableName: Dynamo.TABLE_CATEGORIES,
            Item: {
                id: item.getId(),
                name: item.getName()
            }
        };
        const DATA = await this.DOCUMENT_CLIENT.put(PARAMS).promise();
        return (DATA) ? true : false;
    }

    public async editItem(item: Category): Promise<boolean> {
        const PARAMS = {
            TableName: Dynamo.TABLE_CATEGORIES,
            Key: {
                id: item.getId()
            },
            UpdateExpression: "SET #name = :name",
            ExpressionAttributeValues: {
                ":name": item.getName()
            },
            ExpressionAttributeNames: {
                "#name": "name"
            }
        }
        console.log(PARAMS);
        const DATA = await this.DOCUMENT_CLIENT.update(PARAMS).promise();
        return DATA ? true : false;
    }

    public async deleteItem(id: string): Promise<boolean> {
        const PARAMS = {
            Key: {
                id: id
            },
            TableName: Dynamo.TABLE_CATEGORIES,
            IndexName: "id-index"
        };

        await this.DOCUMENT_CLIENT.delete(PARAMS).promise();
        return true;
    }
}
