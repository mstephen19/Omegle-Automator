import { Box, Form, RangeInput, Text, CheckBox } from 'grommet';
import { memo, useCallback } from 'react';
import { useLocalStorage } from '../hooks';
import { LocalStorageKey } from '../../consts';
import { InfoIcon } from './InfoIcon';

import type { ChangeEventHandler } from 'react';

const Config = memo(() => {
    const [waitSecs, setWaitSecs] = useLocalStorage(
        LocalStorageKey.WAIT_SECS,
        3
    );

    const [startWaitSecs, setStartWaitSecs] = useLocalStorage(
        LocalStorageKey.START_WAIT_SECS,
        0
    );

    const [randomize, setRandomize] = useLocalStorage(
        LocalStorageKey.RANDOMIZE,
        false
    );

    const handleWaitSecsChange: ChangeEventHandler<HTMLInputElement> =
        useCallback((e) => {
            setWaitSecs(e.target.valueAsNumber);
        }, []);

    const handleStartWaitSecsChange: ChangeEventHandler<HTMLInputElement> =
        useCallback((e) => {
            setStartWaitSecs(e.target.valueAsNumber);
        }, []);

    return (
        <Box direction="column" pad="small">
            <Form
                style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}
            >
                <Box direction="column">
                    <Box direction="row" gap="5px">
                        <label htmlFor="start-wait-secs">
                            Start wait seconds
                        </label>
                        <InfoIcon text="The number of seconds to wait before sending the first message in the sequence after connecting to a new chat." />
                    </Box>
                    <Box direction="row">
                        <RangeInput
                            id="start-wait-secs"
                            max={15}
                            min={0}
                            step={1}
                            value={startWaitSecs}
                            onChange={handleStartWaitSecsChange}
                        />
                        <Text style={{ width: '20px', textAlign: 'center' }}>
                            {startWaitSecs}
                        </Text>
                    </Box>
                </Box>

                <Box direction="column">
                    <Box direction="row" gap="5px">
                        <label htmlFor="wait-between">Wait-between</label>
                        <InfoIcon text="The number of seconds to wait between sending messages." />
                    </Box>
                    <Box direction="row">
                        <RangeInput
                            id="wait-between"
                            max={15}
                            min={1}
                            step={1}
                            value={waitSecs}
                            onChange={handleWaitSecsChange}
                            disabled={randomize}
                        />
                        <Text style={{ width: '20px', textAlign: 'center' }}>
                            {waitSecs}
                        </Text>
                    </Box>
                </Box>
                <Box direction="column">
                    <Box direction="row" gap="5px">
                        <CheckBox
                            label="Randomize wait-between"
                            checked={randomize}
                            onChange={(e) => setRandomize(e.target.checked)}
                        />
                        <InfoIcon text='Randomize the wait-between seconds to be anywhere between 3 and 10 seconds. When enabled, the provided "Wait-between" value will be ignored.' />
                    </Box>
                </Box>
            </Form>
        </Box>
    );
});

export default Config;
