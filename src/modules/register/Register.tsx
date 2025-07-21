import {FullscreenPage} from "../../components/fullscreenPage/FullscreenPage.tsx";
import {Button, Form, Input, message, Typography} from "antd";
import {FlexFullWidth} from "../../App.style.tsx";
import {useRegister} from "../../hooks/useApiEndPoint/useRegister.ts";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../routes/constant.ts";

export const Register = () => {
    const [form] = Form.useForm();

    const registerMutation = useRegister();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const handleOnFinish = () => {
        form.validateFields().then((values: { email: string, password: string }) => {
            const url = new URL(window.location.href);
            const token = url.searchParams.get('invitation-token') || '';

            registerMutation.mutate({...values, token}, {
                onSuccess: () => {
                    form.resetFields();
                    messageApi.open({
                        type: 'success',
                        content: 'Inscription effectuée avec succès !',
                    });
                    navigate(ROUTES.HOME);
                }
            });
        }).catch((error) => {
            console.error(error);
        });
    }

    return (
        <>
            {contextHolder}
            <FullscreenPage>
                <FlexFullWidth vertical>
                    <Typography.Title level={3}>Inscription</Typography.Title>
                    <Form form={form} layout="vertical" name="register" onFinish={handleOnFinish}>
                        <Form.Item name="email" label="Email" rules={[{required: true, type: 'email'}]}>
                            <Input/>
                        </Form.Item>
                        <Form.Item name="password" label="Mot de passe" rules={[{required: true}, {
                            pattern: new RegExp("^(?=.*[0-9]).{8,}$"),
                            message: 'Le mot de passe doit contenir au moins 8 caractères et au moins un chiffre'
                        }]}>
                            <Input.Password/>
                        </Form.Item>
                        <Form.Item name="confirmPassword" label="Confirmer le mot de passe" dependencies={['password']}
                                   rules={[
                                       {required: true},
                                       ({getFieldValue}) => ({
                                           validator(_, value) {
                                               if (value && value !== getFieldValue('password')) {
                                                   return Promise.reject(new Error('Les deux mots de passe doivent correspondre !'));
                                               }
                                               return Promise.resolve();
                                           },
                                       })]}>
                            <Input.Password/>
                        </Form.Item>
                        <Button type="primary" htmlType="submit" danger={registerMutation.isError}>
                            S'inscrire
                        </Button>
                    </Form>
                </FlexFullWidth>
            </FullscreenPage>
        </>
    )
}