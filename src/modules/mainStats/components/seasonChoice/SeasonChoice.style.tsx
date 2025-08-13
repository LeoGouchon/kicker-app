import styled from '@emotion/styled';
import { Divider, type DividerProps, Flex, type FlexProps } from 'antd';

export const SeasonCardWrapper = styled(Flex)<FlexProps>`
    height: 100%;
    width: fit-content;
    text-wrap: nowrap;

    max-width: 300px;

    h4 {
        margin: 0;
    }
`;

export const StyledDivider = styled(Divider)<DividerProps>`
    margin: 0;
    height: 20px;
`;
