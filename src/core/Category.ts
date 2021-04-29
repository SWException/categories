export default class Category {

    // CAMPI DATI
    private readonly id: string;
    private readonly name: string;

    // INTERFACCIA PUBBLICA
    public getId (): string {
        return this.id;
    }

    public getName (): string {
        return this.name;
    }

    constructor (id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}
