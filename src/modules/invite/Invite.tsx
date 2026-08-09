import { faClipboard } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Flex, Form, message, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useState } from 'react';

import { identityConfig } from '../../auth/config.ts';
import { FullscreenPage } from '../../components/fullscreenPage/FullscreenPage.tsx';
import { useInvite } from '../../hooks/useApiEndPoint/useInvite.ts';
import { useGetUnlinkedPlayers } from '../../hooks/useApiEndPoint/usePlayer.ts';

export const Invite = () => {
    const [form] = useForm();
    const { isLoading: isPlayersLoading, data: playersResponse } = useGetUnlinkedPlayers();
    const invitePlayerMutation = useInvite();
    const [token, setToken] = useState<string | null>(null);
    const [messageApi, contextHolder] = message.useMessage();

    const handleFinish = () => {
        form.validateFields()
            .then((values: { playerId: string }) => {
                invitePlayerMutation.mutate(values.playerId, {
                    onSuccess: (response) => {
                        setToken(response.token);
                    },
                    onError: (error) => {
                        console.error(error);
                        messageApi.open({
                            type: 'error',
                            content: "Oops, erreur lors de l'invitation du joueur...",
                        });
                    },
                });
            })
            .catch((err) => console.error(err));
    };

    return (
        <>
            {contextHolder}
            <FullscreenPage>
                <Flex vertical gap={'small'}>
                    <Form form={form} layout="vertical" variant={'filled'} onFinish={handleFinish}>
                        <Flex vertical gap={'small'}>
                            <Form.Item
                                name="playerId"
                                label="Joueur à inviter"
                                rules={[{ required: true, message: 'Veuillez choisir un joueur' }]}
                            >
                                <Select
                                    loading={isPlayersLoading}
                                    options={playersResponse?.map((player) => ({
                                        label: player.firstname + ' ' + (player.lastname?.slice(0, 1) ?? ''),
                                        value: player.id,
                                    }))}
                                    showSearch
                                />
                            </Form.Item>
                            <Button type="primary" htmlType="submit">
                                Inviter
                            </Button>
                        </Flex>
                    </Form>
                    {token && (
                        <Button
                            disabled={!token}
                            type="dashed"
                            icon={<FontAwesomeIcon icon={faClipboard} />}
                            onClick={() => {
                                const invitationUrl = new URL('/signup', identityConfig.issuer);
                                invitationUrl.searchParams.set('invitationToken', token);

                                void navigator.clipboard.writeText(invitationUrl.toString());
                                messageApi.open({
                                    type: 'success',
                                    content: 'Lien copié dans le presse-papiers',
                                });
                            }}
                        >
                            Copier le lien dans le presse-papiers
                        </Button>
                    )}
                </Flex>
            </FullscreenPage>
        </>
    );
};
