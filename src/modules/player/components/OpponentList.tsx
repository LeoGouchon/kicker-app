import { Button, List, Typography } from 'antd';
import React, { useState } from 'react';

import { LinkPlayer } from '../../../components/linkPlayer/LinkPlayer.tsx';
import { MAX_DEFAULT_PLAYER_TO_SHOW, MINIMUM_GAME_AGAINST_PLAYER } from '../../../constants.tsx';
import type { PlayerStats } from '../../../types/PlayerStats.type.ts';
import { VerticalCardStats } from '../Player.style.tsx';

const { Text, Title } = Typography;

export const OpponentList = React.memo(({ data }: { data: PlayerStats['statsPerOpponent'] }) => {
    const [visibleCount, setVisibleCount] = useState(MAX_DEFAULT_PLAYER_TO_SHOW);

    const opponents = data
        .filter((opponent) => opponent.wins + opponent.loses >= MINIMUM_GAME_AGAINST_PLAYER)
        .sort((a, b) => b.wins / (b.wins + b.loses) - a.wins / (a.wins + a.loses));

    const visibleOpponents = opponents.slice(0, visibleCount);

    return (
        <VerticalCardStats>
            <Title level={4} style={{ margin: 0 }}>
                Adversaires
            </Title>
            <Text type={'secondary'}>Du + facile au + difficile</Text>
            <List
                dataSource={visibleOpponents}
                renderItem={(opponent) => (
                    <List.Item key={opponent.id}>
                        <LinkPlayer player={opponent} showFullLastName />
                        <Text>
                            {opponent.wins} / {opponent.loses}
                        </Text>
                    </List.Item>
                )}
            />
            {visibleCount < opponents.length && (
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                    <Button type="link" onClick={() => setVisibleCount((v) => v + 10)}>
                        Charger plus
                    </Button>
                </div>
            )}
        </VerticalCardStats>
    );
});

OpponentList.displayName = 'OpponentList';
