import { Link } from 'react-router-dom';

import { ROUTES } from '../../routes/constant.ts';
import type { Player } from '../../types/Player.type.ts';
import { LinkTypographyStyled } from '../typography/Typography.style.tsx';

type LinkPlayerProps = {
    highlightType?: 'success' | 'danger';
    player: Player;
    showFullLastName?: boolean;
};

const capitalize = (value?: string | null) => (value ? value[0].toUpperCase() + value.slice(1) : '');

export const LinkPlayer = ({ highlightType, player, showFullLastName = false }: LinkPlayerProps) => {
    const firstname = capitalize(player.firstname);

    let lastname = capitalize(player.lastname);
    if (!showFullLastName) {
        lastname = lastname ? lastname[0] + '.' : '';
    }

    return (
        <LinkTypographyStyled strong={!!highlightType} type={highlightType}>
            <Link to={ROUTES.PLAYER + '/' + player.id} style={{ all: 'unset' }}>
                {firstname} {lastname}
            </Link>
        </LinkTypographyStyled>
    );
};
