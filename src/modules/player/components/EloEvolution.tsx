import { Card, theme, Typography } from 'antd';
import type { ScriptableContext } from 'chart.js';
import { Line } from 'react-chartjs-2';

const { Title } = Typography;

const MATCH_PER_SEASON_MIN_NUMBER = 0;

export type EloHistory = {
    date: string;
    elo: number;
};

export type SeasonalStats = {
    year: number;
    quarter: number;
    rank: number;
    wins: number;
    losses: number;
    eloHistory: EloHistory[];
};

export type AllTimeStats = {
    wins: number;
    losses: number;
    rank: number;
    eloHistory: EloHistory[];
};

const getCurrentYearAndQuarter = () => {
    const now = new Date();
    const year = now.getFullYear();
    const quarter = Math.floor(now.getMonth() / 3) + 1;
    return { year, quarter: quarter };
};

const getSeasonProgress = () => {
    const now = new Date();
    const startMonth = Math.floor(now.getMonth() / 3) * 3;
    const start = new Date(now.getFullYear(), startMonth, 1);
    const end = new Date(start);
    end.setMonth(start.getMonth() + 3);
    return Math.min(1, Math.max(0, (now.getTime() - start.getTime()) / (end.getTime() - start.getTime())));
};

const normalizeEloToPercent = (eloHistory: EloHistory[], seasonProgress = 1) => {
    const n = eloHistory.length;
    if (n === 0) return { x: [], y: [] };

    const checkedSeasonProgress = Math.min(Math.max(seasonProgress, 0), 1);
    let cutoff = Math.floor(n * checkedSeasonProgress);
    if (cutoff < 2 && n >= 2) cutoff = 2;
    if (cutoff > n) cutoff = n;

    const sliced = eloHistory.slice(0, cutoff);

    const maxX = checkedSeasonProgress * 100;
    const x = cutoff > 1 ? sliced.map((_, i) => (i / (n - 1)) * maxX) : [0];
    const y = sliced.map((e) => e.elo);

    return { x, y };
};

export const EloEvolution = ({ seasonalStats }: { seasonalStats: SeasonalStats[]; allTimeStats: AllTimeStats }) => {
    const { token } = theme.useToken();

    const legendColor = token.colorTextSecondary;
    const axisText = token.colorTextSecondary;
    const axisTitle = token.colorText;
    const gridColor = token.colorBorderSecondary;

    const labels = Array.from({ length: 100 }, (_, i) => `${i + 1}%`);
    const { year: currentYear, quarter: currentQuarter } = getCurrentYearAndQuarter();

    const seasonalData = {
        labels,
        datasets: seasonalStats
            .filter((s) => s.eloHistory.length > MATCH_PER_SEASON_MIN_NUMBER)
            .map((season: SeasonalStats, idx) => {
                const isCurrent = season.year === currentYear && season.quarter === currentQuarter;
                const { x, y } = normalizeEloToPercent(season.eloHistory, isCurrent ? getSeasonProgress() : 1);
                const hue = (idx * 30 - 140) % 360;
                return {
                    label: `${season.year} - ${season.quarter}`,
                    data: x.map((percent, i) => ({ x: percent, y: y[i] })),
                    borderColor: `hsla(${hue}, 70%, ${65 - idx * 5}%, ${1 - idx * 0.3})`,
                    backgroundColor: (context: ScriptableContext<'line'>) => {
                        const { ctx, chartArea } = context.chart;
                        if (!chartArea) return undefined;
                        const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                        g.addColorStop(0, `hsla(${hue}, 70%, 55%, ${0.6 - idx * 0.1})`);
                        g.addColorStop(1, `hsla(${hue}, 70%, 55%, 0)`);
                        return g;
                    },
                    tension: 0.3,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                };
            }),
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index' as const, intersect: false },
        plugins: {
            legend: {
                position: 'top' as const,
                labels: { color: legendColor },
            },
            title: { display: false },
        },
        scales: {
            x: {
                type: 'linear' as const,
                title: { display: true, text: '% de saison', color: axisTitle },
                min: 0,
                max: 100,
                ticks: {
                    color: axisText,
                    callback: (value: number | string) => `${value}%`,
                },
                grid: { color: gridColor },
            },
            y: {
                ticks: { color: axisText },
                grid: { color: gridColor },
            },
        },
    };

    return (
        <Card>
            <Title level={4} style={{ margin: 0 }}>
                Évolution ELO saisonnier
            </Title>
            <div style={{ height: 320 }}>
                <Line data={seasonalData} options={options} />
            </div>
        </Card>
    );
};
