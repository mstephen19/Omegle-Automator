import { Box, Tabs, Tab, Button } from 'grommet';
import { lazy, useCallback } from 'react';
import { PlayFill, StopFill } from 'grommet-icons';
import { useLocalStorage } from './hooks';
import DraggableBox from './components/DraggableBox';
import { LocalStorageKey } from '../consts';
import Automator, { useAutomatorContext } from './components/Automator';

const Interests = lazy(() => import('./components/Interests'));
const Messages = lazy(() => import('./components/Messages'));
const Config = lazy(() => import('./components/Config'));

const Widget = () => {
    const [tab, setTab] = useLocalStorage(LocalStorageKey.TAB, 0);
    const [started, setStarted] = useAutomatorContext();

    const handleStart = useCallback(() => setStarted((prev) => !prev), []);

    return (
        <>
            <DraggableBox
                title="Omegle Automator"
                // hideContent={started}
                alwaysShow={
                    <Box
                        justify="center"
                        align="center"
                        pad="xsmall"
                        style={{
                            maxHeight: '60px',
                            minHeight: '60px',
                        }}
                    >
                        <Button
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: `5px solid ${
                                    started ? 'red' : 'green'
                                }`,
                                height: '50px',
                                width: '50px',
                                borderRadius: '100%',
                                textAlign: 'center',
                            }}
                            onClick={handleStart}
                        >
                            {started && <StopFill color="red" size="medium" />}
                            {!started && (
                                <PlayFill color="green" size="medium" />
                            )}
                        </Button>
                    </Box>
                }
            >
                <Box
                    direction="column"
                    pad="small"
                    style={{ overflowY: 'scroll' }}
                >
                    <Tabs activeIndex={tab} onActive={setTab}>
                        <Tab title="Interests">
                            <Interests />
                        </Tab>
                        <Tab title="Messages">
                            <Messages />
                        </Tab>
                        <Tab title="Config">
                            <Config />
                        </Tab>
                    </Tabs>
                </Box>
            </DraggableBox>
            <Automator />
        </>
    );
};

export default Widget;
