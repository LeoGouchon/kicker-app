import type { ScriptableContext } from 'chart.js';

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
