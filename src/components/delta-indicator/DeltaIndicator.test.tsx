import { describe, expect, it } from 'vitest';

import { renderWithProviders } from '../../test/renderWithProviders.tsx';
import { DeltaIndicator } from './DeltaIndicator.tsx';

describe('DeltaIndicator', () => {
    it.each<[string, number | null, string]>([
        ['the delta is missing', null, '–'],
        ['the delta is zero', 0, '= 0'],
        ['the delta is positive', 12, '12'],
        ['the delta is negative', -8, '8'],
    ])('displays the expected text when %s', (_, delta, expected) => {
        const { container } = renderWithProviders(<DeltaIndicator delta={delta} />);

        // Exact match: a negative delta must show "8", not "-8"
        expect(container).toHaveTextContent(new RegExp(`^${expected}$`));
    });

    it.each<[string, number | null, string | null, string]>([
        ['the delta is missing', null, null, 'ant-typography-secondary'],
        ['the delta is zero', 0, null, 'ant-typography-secondary'],
        ['the delta is positive', 12, 'caret-up', 'ant-typography-success'],
        ['the delta is negative', -8, 'caret-down', 'ant-typography-danger'],
    ])('shows the matching arrow and color when %s', (_, delta, icon, colorClass) => {
        const { container } = renderWithProviders(<DeltaIndicator delta={delta} />);

        const svg = container.querySelector('svg[data-icon]');
        expect(svg?.getAttribute('data-icon') ?? null).toBe(icon);
        expect(container.querySelector('.ant-typography')).toHaveClass(colorClass);
    });
});
