import {Button, Result} from "antd";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../routes/constant.ts";

export const NotFound = () => {
    const navigate = useNavigate();

    return <Result
        status="404"
        title="404"
        subTitle="Oops, la page que vous cherchez n'existe pas."
        extra={<Button type="primary" onClick={() => navigate(ROUTES.HOME)}>Retourner au menu</Button>}
    />
}