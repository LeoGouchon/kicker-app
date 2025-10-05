import { Card, Typography } from 'antd';
import {
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title as ChartTitle,
    Tooltip,
} from 'chart.js';
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTitle, Tooltip, Legend, Filler);

export const EloEvolution = ({
    seasonalStats,
    // allTimeStats,
}: {
    seasonalStats: SeasonalStats[];
    allTimeStats: AllTimeStats;
}) => {
    const labels = Array.from(new Set(seasonalStats.flatMap((s) => s.eloHistory.map((e) => e.date)))).sort();

    const seasonalData = {
        labels,
        datasets: seasonalStats.map((season, idx) => ({
            label: `${season.year} - ${season.quarter}`,
            data: labels.map((label) => {
                const found = season.eloHistory.find((e) => e.date === label);
                return found ? found.elo : null;
            }),
            borderColor: `hsl(${(idx * 60) % 360}, 70%, 50%)`,
            backgroundColor: `hsla(${(idx * 60) % 360}, 70%, 50%, 0.2)`,
            tension: 0.3,
            fill: true,
            pointRadius: 3,
            pointHoverRadius: 5,
        })),
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
                ticks: { color: '#999' },
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
                Évolution ELO
            </Title>
            <div style={{ height: 320 }}>
                <Line data={seasonalData} options={options} />
            </div>
        </Card>
    );
};
