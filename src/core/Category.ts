export default class Category {

    // CAMPI DATI
    private readonly id: string;
    private readonly categoryName: string;

    // INTERFACCIA PUBBLICA
    public getId (): string {
        return this.id;
    }

    public getName (): string {
        return this.categoryName;
    }

    constructor (id: string, categoryName: string) {
        this.id = id;
        this.categoryName = categoryName;
    }
}
