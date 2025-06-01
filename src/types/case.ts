export type Case = {
    id: number;
    name: string;
    birthdate: Date;
    caseDescription: string;
    gender: string;
    types: string[];
    created_at: Date;
    updated_at: Date;
};

export type CaseCreate = {
    name: string;
    birthdate: Date;
    caseDescription: string;
    gender: string;
    types: string[];
};

export type CaseUpdate = {
    name?: string;
    birthdate?: Date;
    caseDescription?: string;
    gender?: string;
    types?: string[];
};


