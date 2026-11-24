import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from 'antd';

import { DeltaIndicatorText } from './DeltaIndicator.style.tsx';

type DeltaIndicatorProps = {
    delta: number | null;
};

export const DeltaIndicator = ({ delta }: DeltaIndicatorProps) => {
    if (delta === null) {
        return <Typography.Text type="secondary">–</Typography.Text>;
    }

    if (delta === 0) {
        return <Typography.Text type="secondary">= 0</Typography.Text>;
    }

    return delta > 0 ? (
        <DeltaIndicatorText trend="up">
            <FontAwesomeIcon icon={faCaretUp} /> {delta}
        </DeltaIndicatorText>
    ) : (
        <DeltaIndicatorText trend="down">
            <FontAwesomeIcon icon={faCaretDown} /> {-delta}
        </DeltaIndicatorText>
    );
};
