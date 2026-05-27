import styled from '@emotion/styled';
import { Typography } from 'antd';
import type { TextProps } from 'antd/es/typography/Text';

export const LinkTypographyStyled = styled(Typography.Text)<TextProps>`
    // Override the default antd styles thanks to the &&
    && {
        cursor: pointer;
        text-wrap: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &:hover {
            color: ${(props) => {
                if (props.type === 'success') return 'var(--ant-color-success-hover)';
                if (props.type === 'danger') return 'var(--ant-color-error-hover)';
                return 'var(--ant-color-text-secondary)';
            }};
        }
    }
`;
