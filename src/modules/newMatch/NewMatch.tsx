import {Col, Flex, Form, Grid, Row, Select} from "antd";
import {FlexFullWidth} from "../../App.style.tsx";
import {useForm} from "antd/es/form/Form";
import {KickerBackground} from "./NewMatch.style.tsx";

export const NewMatch = () => {
    const [form] = useForm();

    return (
        <FlexFullWidth vertical>
            <KickerBackground>

            </KickerBackground>
            <Form
                form={form}
                layout="vertical"
            >
                <Row>
                    <Col span={12}>
                        <Form.Item name="joueurA1" label="Joueur 01 - Equipe 1">
                            <Select/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="joueurB1" label="Joueur 01 - Equipe 2">
                            <Select/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item name="joueurA2" label="Joueur 02 - Equipe 1">
                            <Select/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="joueurB2" label="Joueur 02 - Equipe 2">
                            <Select/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </FlexFullWidth>
    )
}