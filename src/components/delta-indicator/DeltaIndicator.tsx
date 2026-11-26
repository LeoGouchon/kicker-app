import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from 'antd';

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
        <Typography.Text type="success">
            <FontAwesomeIcon icon={faCaretUp} /> {delta}
        </Typography.Text>
    ) : (
        <Typography.Text type="danger">
            <FontAwesomeIcon icon={faCaretDown} /> {-delta}
        </Typography.Text>
    );
};
