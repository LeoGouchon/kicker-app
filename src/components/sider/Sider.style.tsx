import {Layout} from "antd";
import styled from "@emotion/styled";

export const StyledSider = styled(Layout.Sider)`
    margin: 8px;
    border-radius: 16px;
    overflow: hidden;
    
    & > .ant-layout-sider-trigger {
        margin-bottom: 8px;
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
    }
`;
