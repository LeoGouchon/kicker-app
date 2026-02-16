import type { PlayerFilter } from '../../types/PlayerFilter.type.ts';

export const constructComplexPlayerFilter = (playerFilter?: PlayerFilter): string => {
    if (!playerFilter) return '';

    const queryParts: string[] = [`filter.operator=${encodeURIComponent(playerFilter.operator)}`];

    playerFilter.playerGroups.forEach((group, groupIndex) => {
        queryParts.push(`filter.groups[${groupIndex}].operator=${encodeURIComponent(group.operator)}`);

        group.playerIds.forEach((playerId, playerIndex) => {
            queryParts.push(`filter.groups[${groupIndex}].playerIds[${playerIndex}]=${encodeURIComponent(playerId)}`);
        });
    });

    return `&${queryParts.join('&')}`;
};
