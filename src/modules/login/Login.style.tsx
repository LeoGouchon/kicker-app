import styled from "@emotion/styled";
import {Flex, Layout} from "antd";
import {FlexFullWidth} from "../../App.style.tsx";

export const GlobalWrapper = styled(Layout.Content)`
    width: 100%;
       
    display: flex;
`;

export const ImageWrapper = styled.div`
    flex: 2;

    background-image: url('https://plus.unsplash.com/premium_photo-1726877195925-83902dd4f72f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDMwfHx8ZW58MHx8fHx8');
    background-size: cover;
    background-position: center;
`;

export const ContentFlexWrapper = styled(Flex)`
    flex: 3;
`;

export const FormFlexWrapper = styled(Flex)`
    max-width: 400px;
    padding: 32px;
    border-radius: var(--ant-border-radius-lg);
`;

export const FlexHeaderWrapper = styled(FlexFullWidth)`
    height: 100%;
    padding: 0 64px;
`;

export const FlexFooterWrapper = styled(FlexFullWidth)`
    height: 100%;
`;