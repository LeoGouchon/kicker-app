import {Col, Form, InputNumber, Row, Select} from "antd";
import {FlexFullWidth} from "../../App.style.tsx";
import {useForm, useWatch} from "antd/es/form/Form";
import {KickerBackground} from "./NewMatch.style.tsx";
import {useGetPlayers} from "../../hooks/useQuery/usePlayer.ts";

export const NewMatch = () => {
    const [form] = useForm();

    const {isLoading, data: playersResponse} = useGetPlayers({page: 0, size: 100});

    const playersList = playersResponse?.content?.map(player => ({
        label: player.firstname + " " + player.lastname.slice(0, 1),
        value: player.id
    }));

    const joueurA1 = useWatch<string>('joueurA1', form);
    const joueurB1 = useWatch<string>('joueurB1', form);
    const joueurA2 = useWatch<string>('joueurA2', form);
    const joueurB2 = useWatch<string>('joueurB2', form);

    const getAvailablePlayerList = (selectName: "joueurA1" | "joueurB1" | "joueurA2" | "joueurB2") => {
        const selectValuesToExclude = Object.keys({joueurA1, joueurB1, joueurA2, joueurB2})
            .filter(key => key !== selectName)
            .map(key => ({joueurA1, joueurB1, joueurA2, joueurB2}[key] ?? []));
        return playersList?.filter(player => !selectValuesToExclude.includes(player.value));
    }

    console.log(getAvailablePlayerList('joueurA1'))

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
                        <Form.Item name="joueurA1" label="Joueur 01 - Equipe 1" required>
                            <Select
                                loading={isLoading}
                                options={getAvailablePlayerList('joueurA1')}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="joueurB1" label="Joueur 01 - Equipe 2" required>
                            <Select
                                loading={isLoading}
                                options={getAvailablePlayerList('joueurB1')}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item name="joueurA2" label="Joueur 02 - Equipe 1">
                            <Select
                                loading={isLoading}
                                options={getAvailablePlayerList('joueurA2')}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="joueurB2" label="Joueur 02 - Equipe 2">
                            <Select
                                loading={isLoading}
                                options={getAvailablePlayerList('joueurB2')}
                                allowClear
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item name="scoreA" label="Score - Equipe 1">
                            <InputNumber min={-10} max={10} step={1} placeholder={"0"}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="scoreB" label="Score - Equipe 2">
                            <InputNumber min={-10} max={10} step={1} placeholder={"0"}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </FlexFullWidth>
    )
}