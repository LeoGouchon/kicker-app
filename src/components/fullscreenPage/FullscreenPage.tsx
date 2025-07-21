import {
    ContentFlexWrapper, FlexFooterWrapper,
    FlexHeaderWrapper,
    FormFlexWrapper,
    GlobalWrapper,
    ImageWrapper
} from "./FullscreenPage.style.tsx";
import {Button} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {ROUTES} from "../../routes/constant.ts";
import {ThemeSwitcher} from "../header/components/themeSwitcher/ThemeSwitcher.tsx";
import {useNavigate} from "react-router-dom";
import {Footer} from "../footer/Footer.tsx";
import React from "react";

export const FullscreenPage = ({children}: { children: React.ReactNode }) => {
    const navigate = useNavigate();

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
                <FormFlexWrapper>
                    {children}
                </FormFlexWrapper>
                <FlexFooterWrapper align="end">
                    <Footer/>
                </FlexFooterWrapper>
            </ContentFlexWrapper>
        </GlobalWrapper>
    );
};