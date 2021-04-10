import { DYNAMO } from "src/repository/dynamo";
import { buildAjv } from 'src/core/utils/configAjv';
import Ajv from "ajv"
import { DocumentClient } from "aws-sdk/clients/dynamodb";

const AJV: Ajv = buildAjv();

export default class Category {

    // CAMPI DATI
    private readonly id: string;
    private readonly categoryName: string;

    public getId(): string {
        return this.id;
    }
    
    public getName(): string {
        return this.categoryName;
    }
}
