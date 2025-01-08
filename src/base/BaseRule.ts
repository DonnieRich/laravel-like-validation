abstract class BaseRule {
    protected error: string = `Missing default error message for ${this.getName()} applied on {field}`;

    getName(): string {
        return this.pascalCaseToSnakeCase(this.constructor.name)
    }

    getError(): string {
        return this.error
    }

    abstract validate(data: { [s: string]: any }, field: string, value?: any): boolean;
    abstract message(field: string, message: string, value?: any): { name: string, message: string };

    protected generateMessage(data: { [s: string]: string }, message: string) {
        return (message || this.error).replace(/{[\w]+}/g, (match) => {
            const cleanMatch = match.replace(/[{}]/g, '')
            return data[cleanMatch]
        })
    }

    private pascalCaseToSnakeCase(name: string): string {
        return name.replace(/[A-Z]+/g, (m) => name.indexOf(m) === 0 ? m.toLowerCase() : `_${m.toLowerCase()}`)
    }
}

export default BaseRule