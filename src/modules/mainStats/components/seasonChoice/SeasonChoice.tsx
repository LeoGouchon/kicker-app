import { faFutbol, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Flex, Select, Skeleton, Typography } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { FlexFullWidth } from '../../../../App.style.tsx';
import { useGetSeasonsStats } from '../../../../hooks/useApiEndPoint/useStats.ts';
import { ROUTES } from '../../../../routes/constant.ts';
import { SeasonCardWrapper, StyledDivider } from './SeasonChoice.style.tsx';

const { Title, Text } = Typography;

export const SeasonChoice = React.memo(() => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

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

    const SeasonCard = ({
        title,
        nbMatches = 0,
        nbPlayers = 0,
        year = 0,
        quarter = 0,
        isActive = false,
    }: {
        title: string;
        nbMatches?: number;
        nbPlayers?: number;
        year?: number;
        quarter?: number;
        isActive?: boolean;
    }) => (
        <Button
            variant="filled"
            color={
                year.toString() === currentSelectedYear && quarter.toString() === currentSelectedQuarter
                    ? 'primary'
                    : 'default'
            }
            onClick={() => {
                navigate(ROUTES.RANKING + (year !== 0 && quarter !== 0 ? `/${year}/${quarter}` : ''));
            }}
        >
            <SeasonCardWrapper gap={'small'} align={'baseline'}>
                <Title level={4}>{title}</Title>
                <Flex gap={2} align={'center'}>
                    <FontAwesomeIcon icon={faFutbol} />
                    <Text>{nbMatches}</Text>
                </Flex>
                <Flex gap={2} align={'center'}>
                    <FontAwesomeIcon icon={faUser} />
                    <Text>{nbPlayers}</Text>
                </Flex>
                {isActive && (
                    <Text>
                        Encore{' '}
                        {Math.ceil(
                            (Date.UTC(
                                new Date().getUTCMonth() >= 9
                                    ? new Date().getUTCFullYear() + 1
                                    : new Date().getUTCFullYear(),
                                ((Math.floor(new Date().getUTCMonth() / 3) + 1) % 4) * 3,
                                1
                            ) -
                                Date.now()) /
                                (1000 * 60 * 60 * 24)
                        )}
                        j.
                    </Text>
                )}
            </SeasonCardWrapper>
        </Button>
    );

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
            <StyledDivider type={'vertical'} size={'large'} />
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
