import { Card, Typography } from 'antd';
import type { ScriptableContext } from 'chart.js';
import { Line } from 'react-chartjs-2';

const { Title } = Typography;

export type EloHistory = {
    date: string;
    elo: number;
};

export type SeasonalStats = {
    year: string;
    quarter: string;
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

const normalizeEloToPercent = (eloHistory: EloHistory[]) => {
    const n = eloHistory.length;
    if (n === 0) return { x: [], y: [] };

    const x = eloHistory.map((_, i) => (i / (n - 1)) * 100);
    const y = eloHistory.map((e) => e.elo);
    return { x, y };
};

export const EloEvolution = ({
    seasonalStats,
    // allTimeStats,
}: {
    seasonalStats: SeasonalStats[];
    allTimeStats: AllTimeStats;
}) => {
    const labels = Array.from({ length: 100 }, (_, i) => `${i + 1}%`);

    const seasonalData = {
        labels,
        datasets: seasonalStats.map((season, idx) => {
            const { x, y } = normalizeEloToPercent(season.eloHistory);
            const hue = (idx * 60) % 360;

            return {
                label: `${season.year} - ${season.quarter}`,
                data: x.map((percent, i) => ({ x: percent, y: y[i] })),
                borderColor: `hsl(${hue}, 70%, 55%)`,
                backgroundColor: (context: ScriptableContext<'line'>) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null; // chartArea pas dispo au premier render
                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, `hsla(${hue}, 70%, 55%, 0.6)`); // en haut
                    gradient.addColorStop(1, `hsla(${hue}, 70%, 55%, 0)`); // transparent en bas
                    return gradient;
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
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#aaa',
                },
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                type: 'linear' as const,
                title: { display: true, text: '% de saison' },
                min: 0,
                max: 100,
                ticks: {
                    color: '#999',
                    callback: (value: string | number) => `${value}%`,
                },
                grid: { color: '#333' },
            },
            y: {
                ticks: { color: '#999' },
                grid: { color: '#333' },
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
