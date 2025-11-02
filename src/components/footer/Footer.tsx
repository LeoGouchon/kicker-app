import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faFolderClosed } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Flex, Layout, Space, Typography } from 'antd';

import { FlexFullWidth } from '../../App.style.tsx';

const { Text } = Typography;

export const Footer = () => {
    return (
        <Layout.Footer style={{ width: '100%' }}>
            <FlexFullWidth justify={'space-between'} align={'center'}>
                <Space size={2}>
                    <Text>Supported by HubScore ©2025</Text>{' '}
                    <Text type="secondary">(c'est faux, c'était pour faire stylé)</Text>
                </Space>
                <Flex gap={'small'}>
                    <a href={'https://github.com/LeoGouchon'} target={'_blank'}>
                        <FontAwesomeIcon icon={faGithub} />
                    </a>
                    <a href={'https://www.linkedin.com/in/leo-gouchon/'} target={'_blank'}>
                        <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                    <a href={'https://leogouchon.com'} target={'_blank'}>
                        <FontAwesomeIcon icon={faFolderClosed} />
                    </a>
                </Flex>
            </FlexFullWidth>
        </Layout.Footer>
    );
};
