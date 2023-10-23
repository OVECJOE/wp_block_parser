export type Token = {
    type: string,
    value: string,
    start: number,
    end: number,
}

export interface RuleSet {
    [key: string]: RegExp;
}

export enum OperationType {
    CREATE,
    READ,
    UPDATE,
    DELETE,
}

export interface Operation {
    type: OperationType;
    name?: string;
    newValue?: any;
    oldValue?: any;
    expiresAt: number;
}