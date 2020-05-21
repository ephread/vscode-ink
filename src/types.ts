
export interface StatisticsParams {
    workspaceUri: string;
    mainDocumentUri: string;
    statistics: Statistics;
}

export interface Statistics {
    words: number
    knots: number
    stitches: number
    functions: number
    choices: number
    gathers: number
    diverts: number
}

export namespace Statistics {
    export function defaults(): Statistics {
        return {
            words: 0,
            knots: 0,
            stitches: 0,
            functions: 0,
            choices: 0,
            gathers: 0,
            diverts: 0
        };
    }
}
