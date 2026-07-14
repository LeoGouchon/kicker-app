import { App, Empty, Form, Input, Spin, Typography } from 'antd';
import axios from 'axios';

import { FlexFullWidth } from '../../App.style.tsx';
import { MatchLine } from '../../components/matchLine/MatchLine.tsx';
import { useCreatePublicMatch, useGetMatches } from '../../hooks/useApiEndPoint/useMatch.ts';
import type { Match } from '../../types/Match.type.ts';
import { MatchForm } from '../newMatch/components/matchForm/MatchForm.tsx';
import { WrapperTeamSelection } from '../newMatch/NewMatch.style.tsx';

const { Title } = Typography;

const getTodayTimestamp = () => {
    const today = new Date();
    today.setHours(0, 1, 0, 0);
    return today.getTime();
};

const getPublicMatchErrorMessage = (error: unknown) => {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message ?? "Erreur lors de l'enregistrement du match";
    }

    return "Erreur lors de l'enregistrement du match";
};

export const PublicNewMatch = () => {
    const { message } = App.useApp();
    const createPublicMatch = useCreatePublicMatch();
    const { data: matchesResponse, isLoading: isMatchesLoading } = useGetMatches({
        page: 0,
        size: 10,
        dateOrder: 'descend',
        date: getTodayTimestamp(),
    });

    const matches: Match[] = matchesResponse?.content ?? [];

    return (
        <FlexFullWidth vertical gap="large">
            <MatchForm
                title="Créer un match invité"
                submitLabel="Enregistrer avec le code"
                isSubmitting={createPublicMatch.isPending}
                isError={createPublicMatch.isError}
                bottomFields={
                    <WrapperTeamSelection>
                        <FlexFullWidth vertical>
                            <Title level={4}>Information(s) supplémentaire(s)</Title>
                            <FlexFullWidth>
                                <Form.Item
                                    style={{ flex: 1 }}
                                    name="code"
                                    label="Code d'accès"
                                    normalize={(value: string | undefined) => value?.trim().toUpperCase()}
                                    rules={[
                                        { required: true, message: "Veuillez entrer un code d'accès" },
                                        {
                                            pattern: /^[A-Z0-9]{4,64}$/,
                                            message: 'Le code doit contenir 4 à 64 caractères alphanumériques',
                                        },
                                    ]}
                                >
                                    <Input autoComplete="one-time-code" placeholder="SUMMER123" />
                                </Form.Item>
                            </FlexFullWidth>
                        </FlexFullWidth>
                    </WrapperTeamSelection>
                }
                onSubmit={(payload, formValues, form) => {
                    createPublicMatch.mutate(
                        { code: formValues.code ?? '', match: payload },
                        {
                            onSuccess: () => {
                                form.resetFields();
                                void message.success('Match enregistré');
                            },
                            onError: (error) => message.error(getPublicMatchErrorMessage(error)),
                        }
                    );
                }}
            />

            <FlexFullWidth vertical gap="small">
                <Typography.Title level={4}>Derniers matchs enregistrés aujourd'hui</Typography.Title>
                <Spin spinning={isMatchesLoading}>
                    <FlexFullWidth vertical gap="small" align="center">
                        {matches.length === 0 && !isMatchesLoading ? (
                            <Empty description="Aucun match aujourd'hui" />
                        ) : (
                            matches.map((match) => <MatchLine key={match.id} match={match} />)
                        )}
                    </FlexFullWidth>
                </Spin>
            </FlexFullWidth>
        </FlexFullWidth>
    );
};
