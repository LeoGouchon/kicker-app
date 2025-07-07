import {Layout} from "antd";
import styled from "@emotion/styled";

export const StyledSider = styled(Layout.Sider)`
    margin: 8px;
    border-radius: 12px;
    padding: 2px;
    overflow: hidden;
    
    & > .ant-layout-sider-trigger {
        margin-bottom: 8px;
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }
`;
