import { Button, Empty, Flex, Spin } from 'antd';

import { TitleWithoutMargin } from '../../components/typography/Typography.style.tsx';
import { useGetInfiniteMatches } from '../../hooks/useApiEndPoint/useMatch.ts';
import type { Match } from '../../types/Match.type.ts';
import { MatchCard } from './components/MatchCard.tsx';

export const History = () => {
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetInfiniteMatches({
        size: 20,
        dateOrder: 'descend',
    });

    const matches: Match[] = data?.pages.flatMap((p) => p.content) ?? [];
    const isMatchListEmpty = matches?.length === 0;

    return (
        <>
            <TitleWithoutMargin>Historique des matchs</TitleWithoutMargin>
            <Spin spinning={isLoading}>
                <Flex vertical gap={'small'} flex={1} align={'center'}>
                    {matches.length === 0 && !isLoading ? (
                        <Empty description={"Aucun match dans l'historique"} />
                    ) : (
                        matches.map((match) => <MatchCard key={match.id} match={match} />)
                    )}
                </Flex>
            </Spin>

            {!isMatchListEmpty && hasNextPage && (
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Button onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
                        Charger plus
                    </Button>
                </div>
            )}
        </>
    );
};
