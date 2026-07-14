import type { TableProps } from 'antd';
import { App, Button, DatePicker, Flex, Form, Input, InputNumber, Space, Table, Tag, Typography } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

import { FlexFullWidth } from '../../App.style.tsx';
import {
    useCreateKickerMatchAccessCode,
    useGetKickerMatchAccessCodes,
    useRevokeKickerMatchAccessCode,
} from '../../hooks/useApiEndPoint/useKickerMatchAccessCode.ts';
import type {
    CreateKickerMatchAccessCodePayload,
    KickerMatchAccessCode,
} from '../../types/KickerMatchAccessCode.type.ts';

type AccessCodeFormValues = {
    code?: string;
    length?: number;
    expiresAt?: Dayjs;
};

const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp) {
        return '-';
    }

    return new Date(timestamp).toLocaleString('fr-FR', {
        dateStyle: 'short',
        timeStyle: 'short',
    });
};

const formatRemainingTime = (expiresAt: number | null) => {
    if (!expiresAt) {
        return 'Illimité';
    }

    const remainingMs = expiresAt - Date.now();
    if (remainingMs <= 0) {
        return 'Expiré';
    }

    const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
    const days = Math.floor(remainingMinutes / (60 * 24));
    const hours = Math.floor((remainingMinutes - days * 60 * 24) / 60);
    const minutes = remainingMinutes % 60;

    if (days > 0) {
        return `${days}j ${hours}h`;
    }

    if (hours > 0) {
        return `${hours}h ${minutes}min`;
    }

    return `${minutes}min`;
};

export const KickerMatchCodes = () => {
    const [form] = Form.useForm<AccessCodeFormValues>();
    const { message, modal } = App.useApp();
    const { data: codes = [], isLoading } = useGetKickerMatchAccessCodes();
    const createCode = useCreateKickerMatchAccessCode();
    const revokeCode = useRevokeKickerMatchAccessCode();

    const handleFinish = (values: AccessCodeFormValues) => {
        const payload: CreateKickerMatchAccessCodePayload = {
            code: values.code?.trim() || undefined,
            length: values.length,
            expiresAt: values.expiresAt?.valueOf(),
        };

        createCode.mutate(payload, {
            onSuccess: (createdCode) => {
                form.resetFields();
                message.success(`Code ${createdCode.code} créé`);
            },
            onError: () => message.error('Erreur lors de la création du code'),
        });
    };

    const handleRevoke = (code: KickerMatchAccessCode) => {
        modal.confirm({
            title: 'Révoquer le code',
            content: `Le code ${code.code} ne pourra plus être utilisé.`,
            okText: 'Révoquer',
            cancelText: 'Annuler',
            okButtonProps: { danger: true },
            onOk: () =>
                revokeCode.mutate(code.id, {
                    onSuccess: () => message.success('Code révoqué'),
                    onError: () => message.error('Erreur lors de la révocation du code'),
                }),
        });
    };

    const columns: TableProps<KickerMatchAccessCode>['columns'] = [
        {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
            render: (code: string) => <Typography.Text copyable>{code}</Typography.Text>,
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (_, code) => (
                <Tag color={code.status === 'ACTIVE' ? 'green' : 'red'}>
                    {code.status === 'ACTIVE' ? 'Actif' : code.revokedReason === 'EXPIRED' ? 'Expiré' : 'Révoqué'}
                </Tag>
            ),
        },
        {
            title: 'Utilisations',
            dataIndex: 'usageCount',
            key: 'usageCount',
            align: 'right',
        },
        {
            title: 'Temps restant',
            dataIndex: 'expiresAt',
            key: 'remaining',
            render: (expiresAt: number | null) => formatRemainingTime(expiresAt),
        },
        {
            title: 'Expiration',
            dataIndex: 'expiresAt',
            key: 'expiresAt',
            render: (expiresAt: number | null) => formatTimestamp(expiresAt),
        },
        {
            title: 'Dernière utilisation',
            dataIndex: 'lastUsedAt',
            key: 'lastUsedAt',
            render: (lastUsedAt: number | null) => formatTimestamp(lastUsedAt),
        },
        {
            title: 'Créé le',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (createdAt: number) => formatTimestamp(createdAt),
        },
        {
            title: '',
            key: 'actions',
            align: 'right',
            render: (_, code) => (
                <Button
                    danger
                    size="small"
                    disabled={code.status !== 'ACTIVE'}
                    loading={revokeCode.isPending && revokeCode.variables === code.id}
                    onClick={() => handleRevoke(code)}
                >
                    Révoquer
                </Button>
            ),
        },
    ];

    return (
        <FlexFullWidth vertical gap="large">
            <Typography.Title level={3}>Codes de création de match</Typography.Title>

            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Flex gap="small" wrap align="end">
                    <Form.Item
                        name="code"
                        label="Code personnalisé"
                        normalize={(value: string | undefined) => value?.trim().toUpperCase()}
                        rules={[
                            {
                                pattern: /^[A-Z0-9]{4,64}$/,
                                message: 'Le code doit contenir 4 à 64 caractères alphanumériques',
                            },
                        ]}
                    >
                        <Input placeholder="SUMMER2026" />
                    </Form.Item>
                    <Form.Item name="length" label="Longueur générée" initialValue={8}>
                        <InputNumber min={4} max={64} />
                    </Form.Item>
                    <Form.Item
                        name="expiresAt"
                        label="Expiration"
                        rules={[
                            {
                                validator: (_, value: Dayjs | undefined) => {
                                    if (!value || value.isAfter(dayjs())) {
                                        return Promise.resolve();
                                    }

                                    return Promise.reject(new Error("L'expiration doit être dans le futur"));
                                },
                            },
                        ]}
                    >
                        <DatePicker
                            showTime
                            format="DD/MM/YYYY HH:mm"
                            disabledDate={(currentDate) => currentDate && currentDate < dayjs().startOf('day')}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={createCode.isPending}>
                                Créer
                            </Button>
                            <Button htmlType="button" onClick={() => form.resetFields()}>
                                Réinitialiser
                            </Button>
                        </Space>
                    </Form.Item>
                </Flex>
            </Form>

            <Table
                rowKey="id"
                loading={isLoading}
                columns={columns}
                dataSource={codes}
                scroll={{ x: 1100 }}
                pagination={{ pageSize: 10 }}
            />
        </FlexFullWidth>
    );
};
