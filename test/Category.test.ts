import Category from "../src/core/Category"
import { matchersWithOptions } from 'jest-json-schema';
import { JSONSchema7 } from "json-schema";
import { SCHEMAS, setFormats } from '../src/core/utils/configAjv';

expect.extend(matchersWithOptions(SCHEMAS, (ajv) => setFormats(ajv)));

const CATEGORY_SCHEMA: JSONSchema7 = {
    $ref: "../schemas/categories.json#/category"
};
const CATEGORIES_SCHEMA: JSONSchema7 = {
    $ref: "../schemas/categories.json#/categories"
};

test('schema', () => {
    expect(CATEGORY_SCHEMA).toBeValidSchema();
    expect(CATEGORIES_SCHEMA).toBeValidSchema();
});

test('buildCategory', async () => {
    const RES = (await Category.buildCategory("1")).getJson();
    expect(RES).toMatchSchema(CATEGORY_SCHEMA);
});

test('Bad request createNewCategory', async () => {
    const INPUT = {
        dfasfdsf: "sadf"
    }
    const RES = await Category.createNewCategory(JSON.parse(JSON.stringify(INPUT)));
    expect(RES).toBe(false);
});

test('createNewCategory', async () => {
    const INPUT = {
        categoryName: "sciarpe"
    }
    const RES = await Category.createNewCategory(JSON.parse(JSON.stringify(INPUT)));
    expect(RES).toBe(true);
});

test('Bad request updateCategory', async () => {
    const INPUT = {
        dfasfdsf: "sadf"
    }
    const RES = await Category.updateCategory("1", JSON.parse(JSON.stringify(INPUT)));
    expect(RES).toBe(false);
});

test('Null request updateCategory', async () => {
    const RES = await Category.updateCategory("1", null);
    expect(RES).toBe(false);
});

test('updateCategory', async () => {
    const INPUT = { id: "4", categoryName: "lampadine" }
    const RES = await Category.updateCategory("1", JSON.parse(JSON.stringify(INPUT)));
    expect(RES).toBe(true);
});

test('buildAllCategories', async () => {
    const RES = await Category.buildAllCategories();
    expect(RES).toMatchSchema(CATEGORIES_SCHEMA);
});
