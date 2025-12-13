import { faFutbol, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Flex, Typography } from 'antd';
import useBreakpoint from 'antd/es/grid/hooks/useBreakpoint';
import { useLocation, useNavigate } from 'react-router-dom';

import { ROUTES } from '../../../../../routes/constant.ts';
import { SeasonCardWrapper } from '../SeasonChoice.style.tsx';

const { Text, Title } = Typography;

export const SeasonCard = ({
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
}) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const navigate = useNavigate();
    const { pathname } = useLocation();

    const currentSelectedYear = pathname.split('/')[2] || '0';
    const currentSelectedQuarter = pathname.split('/')[3] || '0';

    return (
        <Button
            block={isMobile}
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
};
