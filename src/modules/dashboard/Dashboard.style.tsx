import styled from '@emotion/styled';
import { Card, Flex, Typography } from 'antd';
import type { ComponentProps } from 'react';

type DashboardCardType = 'primary' | 'secondary' | 'superior';
type AntCardProps = Omit<ComponentProps<typeof Card>, 'type'>;

type DashboardCardProps = AntCardProps & {
    disabled?: boolean;
    flex?: number;
    type?: DashboardCardType;
};

const dashboardCardTypeStyles: Record<DashboardCardType, string> = {
    primary: `
        background: var(--ant-color-primary-bg);
        border-color: var(--ant-color-primary-border);

        * {
            color: var(--ant-color-primary) !important;
        }

        &:hover {
            background: var(--ant-color-primary-bg-hover);
            border-color: var(--ant-color-primary-border-hover);
        }

        &:hover * {
            color: var(--ant-color-primary-hover) !important;
        }

        &:active * {
            color: var(--ant-color-primary-active) !important;
        }
    `,
    secondary: `
        border-color: var(--ant-color-border);

        &:hover {
            background: var(--ant-color-fill-secondary);
            border-color: var(--ant-color-border);
        }

        &:active {
            background: var(--ant-color-fill);
        }
    `,
    superior: `
        border-color: transparent;
        background:
            linear-gradient(45deg, var(--ant-blue-1), var(--ant-purple-1)) padding-box,
            linear-gradient(45deg, var(--ant-color-primary), var(--ant-purple-5)) border-box;

        * {
            color: var(--ant-color-primary) !important;
        }

        &:hover {
            background:
                linear-gradient(135deg, var(--ant-blue-2), var(--ant-purple-2)) padding-box,
                linear-gradient(135deg, var(--ant-color-primary-hover), var(--ant-purple-6)) border-box;
        }

        &:hover * {
            color: var(--ant-purple-6) !important;
        }

        &:active {
            background:
                linear-gradient(135deg, var(--ant-blue-3), var(--ant-purple-3)) padding-box,
                linear-gradient(135deg, var(--ant-color-primary-active), var(--ant-purple-7)) border-box;
        }

        &:active * {
            color: var(--ant-purple-7) !important;
        }
    `,
};

const BaseDashboardCard = ({ disabled: _disabled, flex: _flex, type: _type, ...cardProps }: DashboardCardProps) => {
    void _disabled;
    void _flex;
    void _type;

    return <Card {...cardProps} />;
};

export const DashboardCard = styled(BaseDashboardCard)<DashboardCardProps>`
    border-radius: 8px;
    cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
    opacity: ${({ disabled }) => (disabled ? 0.55 : 1)};
    flex: ${({ flex }) => flex || 1};
    ${({ type }) => type && dashboardCardTypeStyles[type]};
`;

export const HoverableDashboardCard = styled(DashboardCard)<DashboardCardProps>`
    ${({ type = 'primary' }) => dashboardCardTypeStyles[type]};
`;

export const CardContent = styled(Flex)`
    min-height: 104px;
`;

export const IconWrapper = styled(Flex)`
    width: 40px;
    height: 40px;
    border-radius: 8px;
    color: var(--ant-color-primary);
    background: var(--ant-color-primary-bg);
    flex: 0 0 auto;
    font-size: var(--ant-font-size-lg);
`;

export const RankingSummarySections = styled(Flex)`
    gap: 16px;
    width: 100%;
`;

export const RankingSummaryList = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;
`;

export const RankingSummaryRow = styled.div`
    display: grid;
    grid-template-columns: 34px minmax(0, 200px) max-content 50px;
    align-items: center;
    gap: 8px;
    min-height: 24px;
`;

export const RankingDeltaText = styled(Typography.Text)<{ delta: 'up' | 'down' }>`
    color: ${({ delta }) => (delta === 'up' ? 'green' : 'red')} !important;
`;

export const HistorySummaryList = styled(Flex)`
    width: 100%;
`;

export const HistorySummaryMatchLine = styled.div`
    padding: 8px 0;
    border-top: 1px solid var(--ant-color-border-secondary);

    &:first-of-type {
        border-top: 0;
        padding-top: 0;
    }
`;
