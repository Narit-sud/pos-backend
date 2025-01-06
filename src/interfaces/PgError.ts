export interface PgError extends Error {
    code?: string;
    length?: number;
    severity?: string;
    schema?: string;
    table?: string;
    constraint?: string;
    file?: string;
    line?: string;
    routine?: string;
}
