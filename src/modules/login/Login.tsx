import {Button, Form, Input, message} from 'antd';
import {useForm} from 'antd/es/form/Form';
import {useNavigate} from 'react-router-dom';

import {FullscreenPage} from '../../components/fullscreenPage/FullscreenPage.tsx';
import {useLogin} from '../../hooks/useApiEndPoint/useLogin.ts';
import {ROUTES} from '../../routes/constant.ts';

export const Login = () => {
    const [form] = useForm();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const useLoginMutate = useLogin();

    const handleForgottenPassword = () => {
        return messageApi.open({
            type: 'info',
            content: 'Et bah dommage pour toi',
        });
    };

    const handleLogin = () => {
        form.validateFields().then((values: { email: string, password: string }) => {
            useLoginMutate.mutate(values,
                {
                    onSuccess: () => {
                        navigate(ROUTES.HOME);
                    },
                    onError: (err) => {
                        console.error(err);
                        form.setFields([
                            {name: 'password', value: ''},
                        ]);
                        form.setFields([
                            {name: 'email', errors: ['Email ou mot de passe incorrect']},
                            {name: 'password', errors: ['Email ou mot de passe incorrect']},
                        ]);
                    }
                });
        });
    };

    return (
        <>
            {contextHolder}
            <FullscreenPage>
                <Form
                    form={form}
                    layout={'vertical'}
                    variant={'filled'}
                    size={'large'}
                    onFinish={handleLogin}
                >
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {required: true, type: 'email', message: 'Veuillez saisir votre email'},
                        ]}
                        validateTrigger={'onBlur'}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item name="password" label="Mot de passe" required>
                        <Input.Password/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="link" variant="link" color="default" onClick={handleForgottenPassword}>mot de
                            passe oublié ?</Button>
                        <Button type="primary" htmlType="submit">Se connecter</Button>
                    </Form.Item>
                </Form>
            </FullscreenPage>
        </>
    );
};