import { Button, Flex, Spin } from 'antd';

import { useGetInfiniteMatches } from '../../hooks/useApiEndPoint/useMatch.ts';
import type { Match } from '../../types/Match.type.ts';
import { MatchCard } from './components/MatchCard.tsx';

export const History = () => {
    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetInfiniteMatches({
        size: 20,
        dateOrder: 'descend',
    });

    const matches: Match[] = data?.pages.flatMap((p) => p.content) ?? [];

    return (
        <>
            <Spin spinning={isLoading}>
                <Flex vertical gap={'small'} flex={1} align={'center'}>
                    {matches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                    ))}
                </Flex>
            </Spin>

            {hasNextPage && (
                <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Button onClick={() => fetchNextPage()} loading={isFetchingNextPage}>
                        Charger plus
                    </Button>
                </div>
            )}
        </>
    );
};
