import { Link } from 'react-router-dom';

import { ROUTES } from '../../routes/constant.ts';
import type { Player } from '../../types/Player.type.ts';
import { LinkTypographyStyled } from '../typography/Typography.style.tsx';

export const LinkPlayer = ({ player, showFullLastName = false }: { player: Player; showFullLastName?: boolean }) => {
    const firstname = player.firstname ? player.firstname[0].toUpperCase() + player.firstname.slice(1) : '';

    let lastname = player.lastname[0].toUpperCase() + player.lastname.slice(1);
    if (!showFullLastName) {
        lastname = (lastname?.[0] ?? '') + '.';
    }

    return (
        <LinkTypographyStyled>
            <Link to={ROUTES.PLAYER + '/' + player.id} style={{ all: 'unset' }}>
                {firstname} {lastname}
            </Link>
        </LinkTypographyStyled>
    );
};
