import {
    ContentFlexWrapper,
    FlexFooterWrapper,
    FlexHeaderWrapper,
    FormFlexWrapper,
    GlobalWrapper,
    ImageWrapper
} from "./Login.style.tsx";
import {Button, Form, Input, message} from "antd";
import {useForm} from "antd/es/form/Form";
import {Footer} from "../../components/footer/Footer.tsx";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../routes/constant.ts";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useLogin} from "../../hooks/useQuery/useLogin.ts";
import {ThemeSwitcher} from "../../components/header/components/themeSwitcher/ThemeSwitcher.tsx";

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
        form.validateFields().then((values: {email: string, password: string}) => {
            useLoginMutate.mutate(values,
            {
                onSuccess: () => {
                    navigate(ROUTES.HOME);
                },
                onError: () => {
                    form.setFields([
                        {name: 'password', value: ''},
                    ]);
                    form.setFields([
                        {name: 'email', errors: ['Email ou mot de passe incorrect']},
                        {name: 'password', errors: ['Email ou mot de passe incorrect']},
                    ]);
                }
            })
        })
    }

    return (
        <GlobalWrapper>
            <ImageWrapper/>
            <ContentFlexWrapper align="center" justify="center" vertical>
                <FlexHeaderWrapper align="end" justify="space-between">
                    <Button
                        type="link"
                        variant="link"
                        color="default"
                        icon={<FontAwesomeIcon icon={faArrowLeft}/>}
                        onClick={() => navigate(ROUTES.HOME)}
                    >
                        Retour
                    </Button>
                    <ThemeSwitcher/>
                </FlexHeaderWrapper>
                <FormFlexWrapper align="center">
                    <Form
                        form={form}
                        layout={'vertical'}
                        variant={"filled"}
                        size={"large"}
                        onFinish={handleLogin}
                    >
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                {required: true, type: 'email', message: 'Veuillez saisir votre email'},
                            ]}
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
                </FormFlexWrapper>
                <FlexFooterWrapper align="end">
                    <Footer/>
                </FlexFooterWrapper>
            </ContentFlexWrapper>
            {contextHolder}
        </GlobalWrapper>
    )
};