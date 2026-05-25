import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '../../routes/constant.ts';

type props = {
    date: string;
};

export const SeasonTag = ({ date }: props) => {
    const navigate = useNavigate();

    const d = new Date(date);
    const year = d.getFullYear();
    const quarter = Math.ceil((d.getMonth() + 1) / 3);
    const colors = ['blue', 'geekblue', 'purple', 'magenta'];

    return (
        <Tag
            variant={'outlined'}
            style={{ cursor: 'pointer', marginRight: 0 }}
            color={colors[quarter - 1]}
            onClick={() => navigate(`${ROUTES.RANKING}/${year}/${quarter}`)}
            icon={<FontAwesomeIcon icon={faArrowUpRightFromSquare} />}
        >
            {` ${year}-${quarter}`}
        </Tag>
    );
};
