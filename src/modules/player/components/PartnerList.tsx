import { Button, List, Typography } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { LinkTypographyStyled } from '../../../components/typography/Typography.style.tsx';
import { ROUTES } from '../../../routes/constant.ts';
import type { PlayerStats } from '../../../types/PlayerStats.type.ts';
import { VerticalCardStats } from '../Player.style.tsx';

const { Text, Title } = Typography;

export const PartnerList = React.memo(({ data }: { data: PlayerStats['statsPerPartner'] }) => {
    const [visibleCount, setVisibleCount] = useState(10);

    const partner = data.sort((a, b) => {
        const aHasEnough = a.wins + a.loses >= 5;
        const bHasEnough = b.wins + b.loses >= 5;
        if (aHasEnough && bHasEnough) return b.wins / (b.wins + b.loses) - a.wins / (a.wins + a.loses);
        if (bHasEnough) return 1;
        if (aHasEnough) return -1;
        return b.wins - a.wins;
    });

    const visiblePartner = partner.slice(0, visibleCount);

    return (
        <VerticalCardStats>
            <Title level={4} style={{ margin: 0 }}>
                Meilleurs partenaires
            </Title>
            <List
                dataSource={visiblePartner}
                renderItem={(partner) => (
                    <List.Item key={partner.id}>
                        <LinkTypographyStyled>
                            <Link to={`${ROUTES.PLAYER}/${partner.id}`} style={{ all: 'unset' }}>
                                <Text strong>
                                    {partner.firstname} {partner.lastname}
                                </Text>
                            </Link>
                        </LinkTypographyStyled>
                        <Text>
                            {partner.wins} / {partner.loses}
                        </Text>
                    </List.Item>
                )}
            />
            {visibleCount < partner.length && (
                <div style={{ textAlign: 'center', marginTop: 12 }}>
                    <Button type="link" onClick={() => setVisibleCount((v) => v + 10)}>
                        Load more
                    </Button>
                </div>
            )}
        </VerticalCardStats>
    );
});
