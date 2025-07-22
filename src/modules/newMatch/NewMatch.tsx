import { Button, Col, Divider, Form, InputNumber, Row, Select, Typography } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { FlexFullWidth } from '../../App.style.tsx';
import { UserContext } from '../../context/UserContext.tsx';
import { useCreateMatch } from '../../hooks/useApiEndPoint/useMatch.ts';
import { useGetPlayers } from '../../hooks/useApiEndPoint/usePlayer.ts';
import { ROUTES } from '../../routes/constant.ts';
import { CreatePlayer } from './components/createPlayer/CreatePlayer.tsx';
import { KickerBackground, WrapperTeamSelection } from './NewMatch.style.tsx';

export const NewMatch = () => {
    const [form] = useForm();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const { isLoading, data: playersResponse } = useGetPlayers({ page: 0, size: 100 });

    const createMatchMutate = useCreateMatch();

    const playersList = playersResponse?.content?.map((player) => ({
        label: player.firstname + ' ' + (player.lastname?.slice(0, 1) ?? ''),
        value: player.id,
    }));

    const joueurA1 = useWatch<string>('joueurA1', form);
    const joueurB1 = useWatch<string>('joueurB1', form);
    const joueurA2 = useWatch<string>('joueurA2', form);
    const joueurB2 = useWatch<string>('joueurB2', form);

    const getAvailablePlayerList = (selectName: 'joueurA1' | 'joueurB1' | 'joueurA2' | 'joueurB2') => {
        const selectValuesToExclude = Object.keys({ joueurA1, joueurB1, joueurA2, joueurB2 })
            .filter((key) => key !== selectName)
            .map((key) => ({ joueurA1, joueurB1, joueurA2, joueurB2 })[key] ?? []);
        return playersList
            ?.filter((player) => !selectValuesToExclude.includes(player.value))
            .sort((a, b) => a.label.localeCompare(b.label));
    };

    const handleFinish = async (formValues: {
        joueurA1: string;
        joueurB1: string;
        joueurA2?: string;
        joueurB2?: string;
        scoreA: number;
        scoreB: number;
    }) => {
        form.validateFields().then(() => {
            createMatchMutate.mutate(
                {
                    scoreA: formValues.scoreA,
                    scoreB: formValues.scoreB,
                    player1AId: formValues.joueurA1,
                    player2AId: formValues.joueurA2,
                    player1BId: formValues.joueurB1,
                    player2BId: formValues.joueurB2,
                },
                {
                    onSuccess: () => {
                        form.resetFields();
                        navigate(ROUTES.HISTORY);
                    },
                }
            );
        });
    };

    return (
        <FlexFullWidth vertical gap={'large'}>
            <KickerBackground></KickerBackground>
            <Form form={form} size="large" layout="vertical" onFinish={handleFinish}>
                <FlexFullWidth vertical gap={'middle'}>
                    <Typography.Title level={3}>Créer un match</Typography.Title>
                    <Row gutter={16}>
                        <Col span={12}>
                            <WrapperTeamSelection vertical team="1">
                                <Typography.Title level={4}>Equipe 1</Typography.Title>
                                <Form.Item
                                    name="joueurA1"
                                    label="Joueur 01"
                                    rules={[{ required: true, type: 'string', message: 'Veuillez choisir un joueur' }]}
                                >
                                    <Select
                                        loading={isLoading}
                                        options={getAvailablePlayerList('joueurA1')}
                                        allowClear
                                        showSearch
                                        filterOption={(input, option) =>
                                            option?.label
                                                .normalize('NFD')
                                                .replace(/[\u0300-\u036f]/g, '')
                                                .toLowerCase()
                                                .includes(input.toLowerCase()) ?? false
                                        }
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="joueurA2"
                                    label="Joueur 02"
                                    rules={[
                                        {
                                            required: !!joueurB2,
                                            type: 'string',
                                            message: 'Veuillez choisir un second joueur pour cette équipe',
                                        },
                                    ]}
                                >
                                    <Select
                                        loading={isLoading}
                                        options={getAvailablePlayerList('joueurA2')}
                                        allowClear
                                        showSearch
                                        filterOption={(input, option) =>
                                            option?.label
                                                .normalize('NFD')
                                                .replace(/[\u0300-\u036f]/g, '')
                                                .toLowerCase()
                                                .includes(input.toLowerCase()) ?? false
                                        }
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="scoreA"
                                    label="Score"
                                    rules={[
                                        { required: true, type: 'number', message: 'Veuillez entrer un score' },
                                        {
                                            validator: (_, value) =>
                                                (value === 10) === (form.getFieldValue('scoreB') !== 10)
                                                    ? Promise.resolve()
                                                    : Promise.reject(),
                                            message: 'Un des deux scores doit être égal à 10',
                                        },
                                    ]}
                                >
                                    <InputNumber min={-10} max={10} step={1} placeholder={'0'} />
                                </Form.Item>
                            </WrapperTeamSelection>
                        </Col>
                        <Col span={12}>
                            <WrapperTeamSelection vertical team="2">
                                <Typography.Title level={4}>Equipe 2</Typography.Title>
                                <Form.Item
                                    name="joueurB1"
                                    label="Joueur 01"
                                    rules={[{ required: true, type: 'string', message: 'Veuillez choisir un joueur' }]}
                                >
                                    <Select
                                        loading={isLoading}
                                        options={getAvailablePlayerList('joueurB1')}
                                        allowClear
                                        showSearch
                                        filterOption={(input, option) =>
                                            option?.label
                                                .normalize('NFD')
                                                .replace(/[\u0300-\u036f]/g, '')
                                                .toLowerCase()
                                                .includes(input.toLowerCase()) ?? false
                                        }
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="joueurB2"
                                    label="Joueur 02"
                                    rules={[
                                        {
                                            required: !!joueurA2,
                                            type: 'string',
                                            message: 'Veuillez choisir un second joueur pour cette équipe',
                                        },
                                    ]}
                                >
                                    <Select
                                        loading={isLoading}
                                        options={getAvailablePlayerList('joueurB2')}
                                        allowClear
                                        showSearch
                                        filterOption={(input, option) =>
                                            option?.label
                                                .normalize('NFD')
                                                .replace(/[\u0300-\u036f]/g, '')
                                                .toLowerCase()
                                                .includes(input.toLowerCase()) ?? false
                                        }
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="scoreB"
                                    label="Score"
                                    rules={[
                                        { required: true, type: 'number', message: 'Veuillez entrer un score' },
                                        {
                                            validator: (_, value) =>
                                                (value === 10) === (form.getFieldValue('scoreA') !== 10)
                                                    ? Promise.resolve()
                                                    : Promise.reject(),
                                            message: 'Un des deux scores doit être égal à 10',
                                        },
                                    ]}
                                >
                                    <InputNumber min={-10} max={10} step={1} placeholder={'0'} />
                                </Form.Item>
                            </WrapperTeamSelection>
                        </Col>
                    </Row>
                    <Button
                        type="primary"
                        danger={createMatchMutate.isError}
                        htmlType="submit"
                        loading={createMatchMutate.isPending}
                    >
                        Enregistrer
                    </Button>
                </FlexFullWidth>
            </Form>
            <Divider />
            {user?.admin && <CreatePlayer />}
        </FlexFullWidth>
    );
};
