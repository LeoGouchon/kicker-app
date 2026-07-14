import { useNavigate } from 'react-router-dom';

import { FlexFullWidth } from '../../App.style.tsx';
import { useCreateMatch } from '../../hooks/useApiEndPoint/useMatch.ts';
import { ROUTES } from '../../routes/constant.ts';
import { MatchForm } from './components/matchForm/MatchForm.tsx';

export const NewMatch = () => {
    const navigate = useNavigate();
    const createMatchMutate = useCreateMatch();

    return (
        <FlexFullWidth vertical gap={'large'}>
            <MatchForm
                title="Créer un match"
                isSubmitting={createMatchMutate.isPending}
                isError={createMatchMutate.isError}
                onSubmit={(payload, _, form) => {
                    createMatchMutate.mutate(payload, {
                        onSuccess: () => {
                            form.resetFields();
                            navigate(ROUTES.HISTORY);
                        },
                    });
                }}
            />
        </FlexFullWidth>
    );
};
