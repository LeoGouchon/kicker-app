import type { ScriptableContext } from 'chart.js';
import type { AnnotationOptions } from 'chartjs-plugin-annotation';

export const getHue = (index: number) => {
    return (index * 30 - 140) % 360;
};

export const getBackgroundColor = (context: ScriptableContext<'line'>, index: number): CanvasGradient | undefined => {
    const { ctx, chartArea } = context.chart;
    const hue = getHue(index);

    if (!chartArea) return undefined;
    const g = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    g.addColorStop(0, `hsla(${hue}, 70%, 55%, ${0.6 - index * 0.1})`);
    g.addColorStop(1, `hsla(${hue}, 70%, 55%, 0)`);
    return g;
};

export const getBorderColor = (index: number) => {
    const hue = getHue(index);
    return `hsla(${hue}, 70%, ${65 - index * 5}%, ${1 - index * 0.3})`;
};

export const GLOBAL_CHART_DATASETS_OPTIONS = {
    tension: 0.3,
    fill: true,
    pointRadius: 3,
    pointHoverRadius: 5,
};

export const getEloAxisRange = ({
    values,
    targetRange = 500,
    anchorElo = 1500,
}: {
    values: number[];
    targetRange?: number;
    anchorElo?: number;
}) => {
    if (values.length === 0) return undefined;
    let min = Math.min(...values);
    let max = Math.max(...values);
    const delta = max - min;
    if (delta < targetRange) {
        const center = (min + max) / 2;
        min = Math.floor(center - targetRange / 2);
        max = Math.ceil(center + targetRange / 2);
    }
    if (anchorElo < min) min = anchorElo;
    if (anchorElo > max) max = anchorElo;
    return { min, max };
};

export const roundTickToStep = ({ value, step = 10 }: { value: number | string; step?: number }) => {
    const numeric = typeof value === 'number' ? value : Number(value);
    if (Number.isNaN(numeric)) return value;
    return Math.round(numeric / step) * step;
};

export const getEloAnchorAnnotation = ({
    anchorElo,
    color,
}: {
    anchorElo: number;
    color: string;
}): AnnotationOptions => ({
    type: 'line' as const,
    yMin: anchorElo,
    yMax: anchorElo,
    borderWidth: 4,
    borderColor: color,
    drawTime: 'beforeDatasetsDraw' as const,
    z: -1,
});
