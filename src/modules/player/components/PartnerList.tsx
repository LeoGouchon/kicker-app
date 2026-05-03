import { Button, List, Typography } from 'antd';
import React, { useState } from 'react';

import { LinkPlayer } from '../../../components/linkPlayer/LinkPlayer.tsx';
import { MAX_DEFAULT_PLAYER_TO_SHOW, MINIMUM_GAME_WITH_PLAYER } from '../../../constants.tsx';
import type { PlayerStats } from '../../../types/PlayerStats.type.ts';
import { VerticalCardStats } from '../Player.style.tsx';

const { Text, Title } = Typography;

export const PartnerList = React.memo(({ data }: { data: PlayerStats['statsPerPartner'] }) => {
    const [visibleCount, setVisibleCount] = useState(MAX_DEFAULT_PLAYER_TO_SHOW);

    const partner = data
        .filter((opponent) => opponent.wins + opponent.loses >= MINIMUM_GAME_WITH_PLAYER)
        .sort((a, b) => b.wins / (b.wins + b.loses) - a.wins / (a.wins + a.loses));

    const visiblePartner = partner.slice(0, visibleCount);

    return (
        <VerticalCardStats>
            <Title level={4} style={{ margin: 0 }}>
                Partenaires
            </Title>
            <Text type={'secondary'}>Du + performant au - performant</Text>
            <List
                dataSource={visiblePartner}
                renderItem={(partner) => (
                    <List.Item key={partner.id}>
                        <LinkPlayer player={partner} showFullLastName />
                        <Text>
                            {partner.wins} / {partner.loses}
                        </Text>
                    </List.Item>
                )}
            />
            {visibleCount < partner.length && (
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                    <Button type="link" onClick={() => setVisibleCount((v) => v + 10)}>
                        Charger plus
                    </Button>
                </div>
            )}
        </VerticalCardStats>
    );
});
