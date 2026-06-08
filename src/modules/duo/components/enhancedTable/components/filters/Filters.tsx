import { Button, Select, type SelectProps } from 'antd';
import { useMemo } from 'react';

import type { TableData } from '../../../../types/TableData.type';
import type { MetricKey } from '../../EnhancedTable.types.ts';
import { metrics } from '../../EnhancedTable.utils.tsx';
import { GlobalWrapper } from './Filters.style.tsx';

type FiltersProps = {
    data: TableData[];
    isMobile: boolean;
    playerIdFilter?: string;
    visibleMetricKeys: MetricKey[];
    onPlayerIdFilterChange: NonNullable<SelectProps<string | undefined>['onChange']>;
    onVisibleMetricKeysChange: NonNullable<SelectProps<MetricKey[], { label: string; value: MetricKey }>['onChange']>;
};

const formatPlayerName = (player: TableData['player1']) => {
    const firstname = player.firstname ?? '';
    const lastname = player.lastname ?? '';

    return `${firstname} ${lastname}`.trim();
};

const normalizeSearchValue = (value: string) =>
    value
        .normalize('NFD')
        .replaceAll(/[\u0300-\u036f]/g, '')
        .toLowerCase();

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

    const resetFilters = () => {
        onPlayerIdFilterChange(undefined);
        onVisibleMetricKeysChange(metricOptions.map((option) => option.value));
    };

    const showSearch: NonNullable<SelectProps['showSearch']> = {
        optionFilterProp: 'label',
        filterOption: (input, option) =>
            normalizeSearchValue(String(option?.label ?? '')).includes(normalizeSearchValue(input)),
    };

    return (
        <GlobalWrapper align={isMobile ? 'stretch' : 'center'} vertical={isMobile} gap={'small'}>
            <Select
                allowClear
                showSearch={showSearch}
                placeholder="Filtrer par joueur"
                value={playerIdFilter}
                onChange={onPlayerIdFilterChange}
                options={playerOptions}
                style={{ width: isMobile ? '100%' : 280 }}
            />
            <Select
                mode="multiple"
                maxTagCount="responsive"
                showSearch={showSearch}
                placeholder="Categories"
                value={visibleMetricKeys}
                onChange={onVisibleMetricKeysChange}
                options={metricOptions}
                style={{ width: isMobile ? '100%' : 360 }}
            />
            <Button color="danger" variant="text" onClick={resetFilters}>
                Réinitialiser les filtres
            </Button>
        </GlobalWrapper>
    );
};
