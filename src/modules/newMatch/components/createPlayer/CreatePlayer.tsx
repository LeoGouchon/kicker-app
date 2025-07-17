import {useForm} from "antd/es/form/Form";
import {Button, Form, Input, message} from "antd";
import {useCreatePlayer} from "../../../../hooks/useQuery/usePlayer.ts";

export const CreatePlayer = () => {
    const [form] = useForm();

    const [messageApi, contextHolder] = message.useMessage();

    const createPlayerMutate = useCreatePlayer();

    const handleFinish = (formValues: {firstname: string, lastname: string}) => {
        form.validateFields().then(() => {
            createPlayerMutate.mutate(formValues, {
                onSuccess: () => {
                    form.resetFields();
                    messageApi.open({
                        type: 'success',
                        content: 'Joueur créé avec succès !',
                    });
                },
                onError: () => {
                    messageApi.open({
                        type: 'error',
                        content: 'Oops, erreur lors de la création du joueur...',
                    });
                }
            });
        });
    }

    return (
        <Form form={form} layout="vertical" name="createPlayer" style={{width: '100%'}} onFinish={handleFinish}>
            <Form.Item name="firstname" label="Prénom" rules={[{required: true, message: 'Veuillez entrer un prénom'}]}>
                <Input />
            </Form.Item>
            <Form.Item name="lastname" label="Nom" rules={[{required: true, message: 'Veuillez entrer un nom'}]}>
                <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={createPlayerMutate.isPending}>Créer le joueur</Button>
            {contextHolder}
        </Form>
    )
}