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
});
