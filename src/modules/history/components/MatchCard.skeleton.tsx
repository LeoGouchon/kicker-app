import { Divider, Flex, Skeleton } from 'antd';

import { ContentWrapper, GlobalWrapper, HeaderWrapper, TeamPlayerWrapper } from './MatchCard.style.tsx';

export const MatchCardSkeleton = ({ fullWidth = false }: { fullWidth?: boolean }) => (
    <GlobalWrapper fullWidth={fullWidth}>
        <HeaderWrapper>
            <Skeleton.Input active size={'small'} style={{ width: 140 }} />
            <Skeleton.Input active size={'small'} style={{ width: 120 }} />
        </HeaderWrapper>

        <Divider style={{ margin: 0 }} />

        <ContentWrapper>
            <TeamPlayerWrapper vertical gap={'small'} side="left">
                <Skeleton.Input active size={'small'} style={{ width: 110 }} />
                <Skeleton.Input active size={'small'} style={{ width: 90 }} />
            </TeamPlayerWrapper>

            <Flex vertical flex={1} align={'center'} gap={'small'}>
                <Skeleton.Input active size={'large'} style={{ width: 88 }} />
                <Skeleton.Input active size={'small'} style={{ width: 72 }} />
            </Flex>

            <TeamPlayerWrapper vertical gap={'small'} side="right">
                <Skeleton.Input active size={'small'} style={{ width: 110 }} />
                <Skeleton.Input active size={'small'} style={{ width: 90 }} />
            </TeamPlayerWrapper>
        </ContentWrapper>
    </GlobalWrapper>
);
