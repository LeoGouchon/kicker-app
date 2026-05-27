import { Empty, Flex, Pagination, Spin, Typography } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';

import { useGetMatches } from '../../../hooks/useApiEndPoint/useMatch.ts';
import { MatchCard } from '../../history/components/MatchCard.tsx';

const { Text, Title } = Typography;
const pageSize = 10;

export const GameHistory = React.memo(() => {
    const { uuid } = useParams();
    const [currentPage, setCurrentPage] = React.useState(1);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [uuid]);

    const { data, isLoading, isFetching } = useGetMatches({
        page: currentPage - 1,
        size: pageSize,
        playerIds: uuid ? [uuid] : undefined,
    });
    const matches = data?.content ?? [];
    const totalMatches = data?.totalElements ?? 0;

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
            <Spin spinning={isLoading || isFetching}>
                <Flex vertical gap={'small'} flex={1} align={'center'}>
                    {matches.length === 0 && !isLoading ? (
                        <Empty description={"Aucun match dans l'historique"} />
                    ) : (
                        matches.map((match) => <MatchCard key={match.id} match={match} />)
                    )}
                </Flex>
            </Spin>
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
