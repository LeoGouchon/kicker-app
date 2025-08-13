import React from 'react';
import { useLocation } from 'react-router-dom';

import { FlexFullWidth } from '../../App.style.tsx';
import { SeasonChoice } from './components/seasonChoice/SeasonChoice.tsx';
import { SeasonStats } from './components/seasonStats/SeasonStats.tsx';

export const MainStats = React.memo(() => {
    const { pathname } = useLocation();

    const currentSelectedYear = parseInt(pathname.split('/')[2]) || 0;
    const currentSelectedQuarter = parseInt(pathname.split('/')[3]) || 0;

    return (
        <FlexFullWidth vertical>
            <SeasonChoice />
            <SeasonStats year={currentSelectedYear} quarter={currentSelectedQuarter} />
        </FlexFullWidth>
    );
});
