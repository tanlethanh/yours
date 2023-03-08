export enum ResourceName {
    TABLE = "Table",
    RESERVATION = "Reservation",
    ORDERITEM = "OrderItem",
    ORDER = "Order",
    NEWCUSTOMER = "NewCustomer"
}

export class NotFoundError extends Error {
    statusCode = 404

    constructor(resourceName: ResourceName, message: string) {
        super(`[NOT FOUND] ${resourceName}: ${message}`)

        // 👇️ because we are extending a built-in class
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    public getErrorMessage() {
        return this.message
    }

    public getStatusCode() {
        return this.statusCode
    }

}

export class MissingConditionError extends Error {
    statusCode = 400

    constructor(resourceName: ResourceName, message: string) {
        super(`[MISSING CONDITION] ${resourceName}: ${message}`)

        // 👇️ because we are extending a built-in class
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }

    public getErrorMessage() {
        return this.message
    }

    public getStatusCode() {
        return this.statusCode
    }

}

