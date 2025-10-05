import styled from '@emotion/styled';
import { Typography } from 'antd';
import type { TextProps } from 'antd/es/typography/Text';

export const LinkTypographyStyled = styled(Typography.Text)<TextProps>`
    // Override the default antd styles thanks to the &&
    && {
        color: var(--ant-color-text);
        cursor: pointer;

        &:hover {
            color: var(--ant-color-text-secondary);
        }
    }
`;
