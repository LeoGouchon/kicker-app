export type PlayerFilter = {
    operator: LogicalOperators;
    playerGroups: PlayerGroup[];
};

export type LogicalOperators = 'AND' | 'OR';

export type PlayerGroupOperator = 'AND' | 'OR' | 'WITH' | 'AGAINST';

export type PlayerGroup = {
    operator: PlayerGroupOperator;
    playerIds: string[];
};
