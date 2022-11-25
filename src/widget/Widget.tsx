import { Box, Tabs, Tab, Button, Tag, Text, Anchor } from 'grommet';
import { lazy, useCallback } from 'react';
import { PlayFill, StopFill } from 'grommet-icons';
import { toast } from 'react-hot-toast';
import { useFetch, useLocalStorage } from './hooks';
import DraggableBox from './components/DraggableBox';
import {
    CURRENT_VERSION,
    LATEST_RELEASE_URL,
    LocalStorageKey,
    WEBSTORE_LINK,
} from '../consts';
import Automator, {
    useAutomatorContext,
    getMessages,
} from './components/Automator';
import type { LatestRelease } from '../types';

const Interests = lazy(() => import('./components/Interests'));
const Messages = lazy(() => import('./components/Messages'));
const Config = lazy(() => import('./components/Config'));

const Widget = () => {
    const [tab, setTab] = useLocalStorage(LocalStorageKey.TAB, 0);
    const [started, setStarted] = useAutomatorContext();
    const { data, loading, error } =
        useFetch<LatestRelease>(LATEST_RELEASE_URL);

    const handleStart = useCallback(() => {
        if (!getMessages().length && !started) {
            return toast.error('Must provide at least one message!');
        }

        setStarted((prev) => !prev);
    }, [started]);

    return (
        <>
            <DraggableBox
                title="Omegle Automator"
                // hideContent={started}
                alwaysShow={
                    <Box
                        direction="row"
                        justify="center"
                        align="center"
                        pad="xsmall"
                        style={{
                            maxHeight: '60px',
                            minHeight: '60px',
                        }}
                    >
                        <Box
                            flex
                            direction="column"
                            height="50px"
                            width="100px"
                            justify="end"
                            pad="xxsmall"
                        >
                            <Box width="fit-content">
                                <Tag
                                    name="Version"
                                    value={CURRENT_VERSION}
                                    size="small"
                                />
                            </Box>
                        </Box>
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
                        <Box
                            flex
                            direction="column"
                            justify="end"
                            align="end"
                            height="50px"
                            width="100px"
                            pad="xxsmall"
                        >
                            <Box width="fit-content">
                                <Text
                                    textAlign="end"
                                    size="small"
                                    color={
                                        (data &&
                                            data.tag_name !==
                                                CURRENT_VERSION) ||
                                        error
                                            ? 'red'
                                            : ''
                                    }
                                >
                                    {error && 'Failed to fetch latest version'}
                                    {loading && 'Fetching latest...'}
                                    {!loading &&
                                    data &&
                                    data.tag_name !== CURRENT_VERSION ? (
                                        <>
                                            Latest version is{' '}
                                            <Anchor
                                                href={WEBSTORE_LINK}
                                                title="Download the latest version"
                                                label={data.tag_name}
                                                target="_blank"
                                            />
                                        </>
                                    ) : (
                                        "You're up to date!"
                                    )}
                                </Text>
                            </Box>
                        </Box>
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
