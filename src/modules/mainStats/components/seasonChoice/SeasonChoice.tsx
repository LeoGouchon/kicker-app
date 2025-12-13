import { faFutbol, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, Select, Skeleton, Typography } from 'antd';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { FlexFullWidth } from '../../../../App.style.tsx';
import { useGetSeasonsStats } from '../../../../hooks/useApiEndPoint/useStats.ts';
import { ROUTES } from '../../../../routes/constant.ts';
import { SeasonCard } from './components/SeasonCard.tsx';
import { StyledDivider } from './SeasonChoice.style.tsx';

const { Title, Text } = Typography;

export const SeasonChoice = React.memo(() => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const currentSelectedYear = pathname.split('/')[2] || '0';
    const currentSelectedQuarter = pathname.split('/')[3] || '0';

    const { isLoading = true, data: seasonsData } = useGetSeasonsStats();

    const previousSeasonOptions =
        seasonsData?.seasonsStats
            .slice(0, seasonsData?.seasonsStats.length - 1)
            .reverse()
            .map((season) => ({
                value: `${season.year}-${season.quarter}`,
                label: (
                    <FlexFullWidth align={'baseline'} gap={'small'}>
                        <Title level={4} style={{ margin: '0 0 0 4px' }}>{`Saison ${season.seasonIndex}`}</Title>
                        <Flex gap={2} align={'center'}>
                            <FontAwesomeIcon icon={faFutbol} />
                            <Text>{season.nbMatches}</Text>
                        </Flex>
                        <Flex gap={2} align={'center'}>
                            <FontAwesomeIcon icon={faUser} />
                            <Text>{season.nbPlayers}</Text>
                        </Flex>
                    </FlexFullWidth>
                ),
            })) ?? [];

    if (isLoading)
        return (
            <FlexFullWidth gap={'small'} style={{ width: '100%' }} align={'center'}>
                <Skeleton.Input active />
                <StyledDivider type={'vertical'} size={'large'} />
                <Skeleton.Input active />
            </FlexFullWidth>
        );

    return (
        <FlexFullWidth gap={'small'} style={{ width: '100%' }} align={'center'} wrap>
            <SeasonCard
                title={'Tous les matchs'}
                nbMatches={seasonsData?.totalMatches}
                nbPlayers={seasonsData?.totalPlayers}
            />
            {!isMobile && <StyledDivider type={'vertical'} size={'large'} />}
            {seasonsData?.seasonsStats.slice(-1).map((season) => (
                <SeasonCard
                    key={`${season.year}-${season.quarter}`}
                    title={`Saison ${season.seasonIndex}`}
                    nbMatches={season.nbMatches}
                    nbPlayers={season.nbPlayers}
                    isActive
                    year={season.year}
                    quarter={season.quarter}
                />
            ))}
            {seasonsData!.nbSeasons > 1 && (
                <Select
                    size="middle"
                    variant={
                        previousSeasonOptions?.find(
                            (option) => option.value === `${currentSelectedYear}-${currentSelectedQuarter}`
                        )
                            ? 'filled'
                            : 'borderless'
                    }
                    placeholder={'Saisons précédentes'}
                    value={previousSeasonOptions?.find(
                        (option) => option.value === `${currentSelectedYear}-${currentSelectedQuarter}`
                    )}
                    options={previousSeasonOptions}
                    styles={{
                        popup: {
                            root: {
                                width: 'fit-content',
                            },
                        },
                        root: {
                            backgroundColor: previousSeasonOptions?.find(
                                (option) => option.value === `${currentSelectedYear}-${currentSelectedQuarter}`
                            )
                                ? 'var(--ant-color-primary-bg)'
                                : '',
                            borderRadius: '6px',
                        },
                    }}
                    onChange={(value) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        const [year, quarter] = value.split('-');
                        console.log(value);
                        navigate(
                            ROUTES.RANKING +
                                (parseInt(year) !== 0 && parseInt(quarter) !== 0 ? `/${year}/${quarter}` : '')
                        );
                    }}
                />
            )}
        </FlexFullWidth>
    );
});
