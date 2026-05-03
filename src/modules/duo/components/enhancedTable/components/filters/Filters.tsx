import { Select, type SelectProps } from 'antd';
import { type Dispatch, type SetStateAction, useMemo } from 'react';

import type { TableData } from '../../../../types/TableData.type';
import { type MetricKey, metrics } from '../../EnhancedTable.utils.tsx';

type FiltersProps = {
    data: TableData[];
    isMobile: boolean;
    playerIdFilter?: string;
    visibleMetricKeys: MetricKey[];
    onPlayerIdFilterChange: Dispatch<SetStateAction<string | undefined>>;
    onVisibleMetricKeysChange: NonNullable<SelectProps<MetricKey[], { label: string; value: MetricKey }>['onChange']>;
};

const formatPlayerName = (player: TableData['player1']) => {
    const firstname = player.firstname ?? '';
    const lastname = player.lastname ?? '';

    return `${firstname} ${lastname}`.trim();
};

export const Filters = ({
    data,
    isMobile,
    playerIdFilter,
    visibleMetricKeys,
    onPlayerIdFilterChange,
    onVisibleMetricKeysChange,
}: FiltersProps) => {
    const playerOptions = useMemo(() => {
        const playersById = new Map<string, string>();

        data.forEach((record) => {
            [record.player1, record.player2].forEach((player) => {
                playersById.set(player.id, formatPlayerName(player));
            });
        });

        return [...playersById.entries()]
            .map(([value, label]) => ({ value, label }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, [data]);
    const metricOptions = useMemo(() => metrics.map((metric) => ({ label: metric.title, value: metric.key })), []);

    return (
        <>
            <Select
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder="Filtrer par joueur"
                value={playerIdFilter}
                onChange={onPlayerIdFilterChange}
                options={playerOptions}
                style={{ width: isMobile ? '100%' : 280 }}
            />
            <Select
                mode="multiple"
                maxTagCount="responsive"
                optionFilterProp="label"
                placeholder="Categories"
                value={visibleMetricKeys}
                onChange={onVisibleMetricKeysChange}
                options={metricOptions}
                style={{ width: isMobile ? '100%' : 360 }}
            />
        </>
    );
};
