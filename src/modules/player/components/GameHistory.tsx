import { Button, Empty, Flex, Pagination, Result, Typography } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

import { useGetMatches } from '../../../hooks/useApiEndPoint/useMatch.ts';
import { MatchCardSkeleton } from '../../history/components/MatchCard.skeleton.tsx';
import { MatchCard } from '../../history/components/MatchCard.tsx';

const { Text, Title } = Typography;
const pageSize = 10;

export const GameHistory = React.memo(() => {
    const { uuid } = useParams();
    const [currentPage, setCurrentPage] = React.useState(1);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [uuid]);

    const { data, isError, isLoading, refetch } = useGetMatches({
        page: currentPage - 1,
        size: pageSize,
        playerIds: uuid ? [uuid] : undefined,
    });
    const matches = data?.content ?? [];
    const totalMatches = data?.totalElements ?? 0;
    const showSkeleton = isLoading && matches.length === 0;

    return (
        <Flex vertical gap={'small'}>
            <Flex align={'baseline'} justify={'space-between'}>
                <Title level={4} style={{ margin: 0 }}>
                    Historique des parties <Text type="secondary">({totalMatches} matchs)</Text>
                </Title>
                {totalMatches > pageSize && (
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        showSizeChanger={false}
                        total={totalMatches}
                        onChange={setCurrentPage}
                        align={'end'}
                        size={'small'}
                    />
                )}
            </Flex>
            <Flex vertical gap={'small'} flex={1} align={'center'}>
                {isError ? (
                    <Result
                        status={'error'}
                        title={"Impossible de charger l'historique des parties."}
                        extra={
                            <Button type={'primary'} onClick={() => refetch()}>
                                Réessayer
                            </Button>
                        }
                    />
                ) : showSkeleton ? (
                    Array.from({ length: pageSize }, (_, index) => <MatchCardSkeleton key={index} fullWidth />)
                ) : matches.length === 0 ? (
                    <Empty description={"Aucun match dans l'historique"} />
                ) : (
                    matches.map((match) => (
                        <MatchCard key={match.id} match={match} fullWidth highlightPlayerId={uuid} />
                    ))
                )}
            </Flex>
            {totalMatches > pageSize && (
                <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    showSizeChanger={false}
                    total={totalMatches}
                    onChange={setCurrentPage}
                    align={'end'}
                    size={'small'}
                />
            )}
        </Flex>
    );
});
