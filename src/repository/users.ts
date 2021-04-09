export interface Users {
    checkVendor(token: string): Promise<boolean>
}