import Model from "../src/core/model"
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

const MODEL = Model.createModelMock();

test('get category', async () => {
    const RES = await MODEL.getCategory("1");
    expect(RES).toMatchSchema(CATEGORY_SCHEMA);
});

test('get categories', async () => {
    const RES = await MODEL.getCategories();
    expect(RES).toMatchSchema(CATEGORIES_SCHEMA);
});

test('create category', async () => {
    const RES = await MODEL.createCategory("peluches", "token");
    expect(RES).toBe(true);
});

test('error create category', async () => {
    const RES = await MODEL.createCategory(null, "token");
    expect(RES).toBe(false);
});

test('error create category no token passed', async () => {
    function test(){
        return MODEL.createCategory("descrizione", null);
    }
    await expect(test).rejects.toThrow(Error);
});

test('update category', async () => {
    const RES = await MODEL.updateCategory("token", "1", "lego");
    expect(RES).toBe(true);
});

test('error update category', async () => {
    let res = await MODEL.updateCategory("token", "2", null);
    expect(res).toBe(false);
    res = await MODEL.updateCategory("token", null, null);
    expect(res).toBe(false);
});

test('error update category no token', async () => {
    function test(){
        return MODEL.updateCategory(null, "descrizione", "category");
    }
    await expect(test).rejects.toThrow(Error);
});

test('delete category', async () => {
    const RES = await MODEL.deleteCategory("1", "token");
    expect(RES).toBe(true);
});

test('error delete category', async () => {
    const RES = await MODEL.deleteCategory(null, "token");
    expect(RES).toBe(false);
});

test('error delete category no token', async () => {
    function test(){
        return MODEL.deleteCategory("1", null);
    }
    await expect(test).rejects.toThrow(Error);
});
