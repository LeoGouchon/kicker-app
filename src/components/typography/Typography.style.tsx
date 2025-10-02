import styled from '@emotion/styled';
import { Typography } from 'antd';

export const LinkTypographyStyled = styled(Typography.Link)`
    // Override the default antd styles thanks to the &&
    && {
        color: var(--ant-color-text);

        &:hover {
            color: var(--ant-color-text-secondary);
        }
    }
`;
