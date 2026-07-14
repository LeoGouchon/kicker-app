import type { FormInstance } from 'antd';
import { Button, Form, Radio, Select, Typography } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import type { ReactNode } from 'react';

import { FlexFullWidth } from '../../../../App.style.tsx';
import { useGetPlayers } from '../../../../hooks/useApiEndPoint/usePlayer.ts';
import { FlexScoreWrapper, RadioGroupStyled, WrapperTeamSelection } from '../../NewMatch.style.tsx';

export type MatchPayload = {
    scoreA: number;
    scoreB: number;
    player1AId: string;
    player2AId?: string;
    player1BId: string;
    player2BId?: string;
};

export type MatchFormValues = {
    code?: string;
    joueurA1: string;
    joueurB1: string;
    joueurA2?: string;
    joueurB2?: string;
    scoreA: number;
    scoreB: number;
};

type MatchFormProps = {
    title: string;
    submitLabel?: string;
    isSubmitting?: boolean;
    isError?: boolean;
    bottomFields?: ReactNode;
    onSubmit: (...args: [MatchPayload, MatchFormValues, FormInstance<MatchFormValues>]) => void;
};

export const MatchForm = ({
    title,
    submitLabel = 'Enregistrer',
    isSubmitting,
    isError,
    bottomFields,
    onSubmit,
}: MatchFormProps) => {
    const [form] = useForm<MatchFormValues>();

    const { isLoading, data: playersResponse } = useGetPlayers({ page: 0, size: 50 });

    const playersList = playersResponse?.content?.map((player) => ({
        label: player.firstname + ' ' + (player.lastname?.slice(0, 1) ?? ''),
        value: player.id,
    }));

    const joueurA1 = useWatch<string>('joueurA1', form);
    const joueurB1 = useWatch<string>('joueurB1', form);
    const joueurA2 = useWatch<string>('joueurA2', form);
    const joueurB2 = useWatch<string>('joueurB2', form);

    const getAvailablePlayerList = (selectName: 'joueurA1' | 'joueurB1' | 'joueurA2' | 'joueurB2') => {
        const selectedPlayers = { joueurA1, joueurB1, joueurA2, joueurB2 };
        const selectValuesToExclude = new Set(
            Object.keys(selectedPlayers)
                .filter((key) => key !== selectName)
                .map((key) => selectedPlayers[key as keyof typeof selectedPlayers] ?? [])
        );
        return playersList
            ?.filter((player) => !selectValuesToExclude.has(player.value))
            .sort((a, b) => a.label.localeCompare(b.label));
    };

    const getSearchablePlayerLabel = (label: unknown) => {
        if (typeof label === 'string' || typeof label === 'number') {
            return String(label);
        }

        return '';
    };

    const filterPlayerOption = (input: string, option?: { label?: unknown }) =>
        getSearchablePlayerLabel(option?.label)
            .normalize('NFD')
            .replaceAll(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .includes(input.toLowerCase());

    const playerSearch = {
        filterOption: filterPlayerOption,
    };

    const handleFinish = (formValues: MatchFormValues) => {
        const payload: MatchPayload = {
            scoreA: formValues.scoreA,
            scoreB: formValues.scoreB,
            player1AId: formValues.joueurA1,
            player2AId: formValues.joueurA2,
            player1BId: formValues.joueurB1,
            player2BId: formValues.joueurB2,
        };

        onSubmit(payload, formValues, form);
    };

    return (
        <Form form={form} size={'middle'} layout="vertical" onFinish={handleFinish}>
            <FlexFullWidth vertical gap={'middle'}>
                <Typography.Title level={3}>{title}</Typography.Title>
                <FlexScoreWrapper>
                    <WrapperTeamSelection vertical>
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
                                showSearch={playerSearch}
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
                                showSearch={playerSearch}
                            />
                        </Form.Item>
                        <Form.Item
                            name="scoreA"
                            label="Score"
                            dependencies={['scoreB']}
                            rules={[
                                { required: true, type: 'number', message: 'Veuillez entrer un score' },
                                {
                                    validator: (_, value) => {
                                        const scoreB = form.getFieldValue('scoreB');

                                        if (!scoreB) {
                                            return Promise.resolve();
                                        }

                                        if (value === 10 && scoreB !== 10) {
                                            return Promise.resolve();
                                        }

                                        if (value !== 10 && scoreB === 10) {
                                            return Promise.resolve();
                                        }

                                        if (value === scoreB) {
                                            return Promise.reject();
                                        }

                                        if (value < 10 && scoreB < 10) {
                                            return Promise.reject();
                                        }

                                        return Promise.resolve();
                                    },
                                    message: 'Un des deux scores doit être égal à 10',
                                },
                            ]}
                        >
                            <RadioGroupStyled>
                                {Array.from({ length: 11 }, (_, index) => index).map((index) => (
                                    <Radio.Button
                                        key={index}
                                        value={index}
                                        onClick={() => form.setFieldValue('scoreA', index)}
                                    >
                                        {index}
                                    </Radio.Button>
                                ))}
                            </RadioGroupStyled>
                        </Form.Item>
                    </WrapperTeamSelection>
                    <WrapperTeamSelection vertical>
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
                                showSearch={playerSearch}
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
                                showSearch={playerSearch}
                            />
                        </Form.Item>
                        <Form.Item
                            name="scoreB"
                            label="Score"
                            dependencies={['scoreA']}
                            rules={[
                                { required: true, type: 'number', message: 'Veuillez entrer un score' },
                                {
                                    validator: (_, value) => {
                                        const scoreA = form.getFieldValue('scoreA');

                                        if (!scoreA) {
                                            return Promise.resolve();
                                        }

                                        if (value === 10 && scoreA !== 10) {
                                            return Promise.resolve();
                                        }

                                        if (value !== 10 && scoreA === 10) {
                                            return Promise.resolve();
                                        }

                                        if (value === scoreA) {
                                            return Promise.reject();
                                        }

                                        return Promise.resolve();
                                    },
                                    message: 'Un des deux scores doit être égal à 10',
                                },
                            ]}
                        >
                            <RadioGroupStyled>
                                {Array.from({ length: 11 }, (_, index) => index).map((index) => (
                                    <Radio.Button
                                        key={index}
                                        value={index}
                                        onClick={() => form.setFieldValue('scoreB', index)}
                                    >
                                        {index}
                                    </Radio.Button>
                                ))}
                            </RadioGroupStyled>
                        </Form.Item>
                    </WrapperTeamSelection>
                </FlexScoreWrapper>
                {bottomFields}
                <Button type="primary" danger={isError} htmlType="submit" loading={isSubmitting}>
                    {submitLabel}
                </Button>
            </FlexFullWidth>
        </Form>
    );
};
