import * as AWS from "aws-sdk";
import generateID from "src/utils/generateID";

const DOCUMENT_CLIENT =
    new AWS.DynamoDB.DocumentClient({ region: "eu-central-1" });
export const DYNAMO = {

    /**
     * 
     * @param TableName name of the table
     * @returns all the tuples in the table
     */
    async getScan(TableName: string):
        Promise<AWS.DynamoDB.DocumentClient.AttributeMap> {
        const PARAMS = {
            TableName: TableName
        };

        const DATA = await DOCUMENT_CLIENT
            .scan(PARAMS).promise()
            .catch((err) => console.log(err.message));
        console.log("Data from DB: " + JSON.stringify(DATA));
        return DATA ? DATA.Items : null;
    },

    /**
     * 
     * @param TableName name of the table
     * @param id id (partition key) value
     * @returns the object with the given id
     */
    async get(TableName: string, id: string):
        Promise<AWS.DynamoDB.DocumentClient.AttributeMap> {
        const PARAMS = {
            Key: {
                id: id
            },
            TableName: TableName,
            IndexName: "id-index"
        };

        const DATA = await DOCUMENT_CLIENT
            .get(PARAMS).promise()
            .catch((err) => console.log(err.message));
        console.log("Data from DB: " + JSON.stringify(DATA));
        return DATA ? DATA.Item : null;
    },

    /**
     * 
     * @param TableName name of the table
     * @param data data to write
     * @returns result of the insert query 
     */
    async write(TableName: string, data: { [key: string]: any }): Promise<boolean> {

        const KEY = generateID();
        data["id"] = KEY;
        const PARAMS = {
            TableName: TableName,
            Key: {
                id: KEY
            },
            Item: data
        };
        const DATA = await DOCUMENT_CLIENT.put(PARAMS).promise().catch(
            () => { return false; }
        );
        return (DATA) ? true : false;
    },

    /**
     * 
     * @param TableName the name of the table
     * @param id the id (partition key) value 
     * @param data data to update
     * @returns the result of the update query
     */

    async update(TableName: string, id: string, data: JSON): Promise<boolean> {
        const VALUES = {};
        let expression = "SET ";
        let first = true;

        Object.keys(data).forEach(function (key) {
            if (key != "id") {
                const VALUE = data[key];
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
            TableName: TableName,
            Key: {
                id: id
            },
            UpdateExpression: expression,
            ExpressionAttributeValues: VALUES
        }
        console.log(PARAMS);

        const DATA = await DOCUMENT_CLIENT.update(PARAMS).promise().catch(
            (err) => { console.log(err.message); }
        );
        return DATA ? true : false;
    }
}
