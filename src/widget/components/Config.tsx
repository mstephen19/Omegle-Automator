import { Box, Form, RangeInput, Text, CheckBox, TextInput } from 'grommet';
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

    const [useInterests, setUseInterests] = useLocalStorage(
        LocalStorageKey.USE_INTERESTS,
        true
    );

    const [stopAfterMins, setStopAfterMins] = useLocalStorage<number | null>(
        LocalStorageKey.STOP_AFTER_MINS,
        0
    );

    const handleWaitSecsChange: ChangeEventHandler<HTMLInputElement> =
        useCallback((e) => {
            setWaitSecs(e.target.valueAsNumber);
        }, []);

    const handleStartWaitSecsChange: ChangeEventHandler<HTMLInputElement> =
        useCallback((e) => {
            setStartWaitSecs(e.target.valueAsNumber);
        }, []);

    const handleRandomizeChange: ChangeEventHandler<HTMLInputElement> =
        useCallback((e) => setRandomize(e.target.checked), []);

    const handleUseInterestsChange: ChangeEventHandler<HTMLInputElement> =
        useCallback((e) => setUseInterests(e.target.checked), []);

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
                        <label htmlFor="stop-after">Stop after minutes</label>
                        <InfoIcon text="The number of minutes the bot should run before being automatically stopped. If 0 is provided, the bot will run endlessly. The maximum possible value is 1440 minutes" />
                    </Box>
                    <Box direction="row" width="fit-content">
                        <TextInput
                            placeholder="0"
                            type="number"
                            value={stopAfterMins === null ? '' : stopAfterMins}
                            step={30}
                            onChange={(e) => {
                                // Only match numbers or nothing
                                if (!/^(\d+)?$/g.test(e.target.value)) return;

                                // If we've got an empty string, set the value to null.
                                if (!e.target.value) {
                                    return setStopAfterMins(null);
                                }

                                // If the number is less than 0 or greater than 24hrs,
                                // do nothing.
                                const num = +e.target.value;
                                if (num < 0 || num > 24 * 60) return;

                                setStopAfterMins(num);
                            }}
                        />
                    </Box>
                </Box>

                <Box direction="column">
                    <Box direction="row" gap="5px">
                        <CheckBox
                            label="Randomize wait-between"
                            checked={randomize}
                            onChange={handleRandomizeChange}
                        />
                        <InfoIcon text='Randomize the wait-between seconds to be anywhere between 3 and 10 seconds. When enabled, the provided "Wait-between" value will be ignored.' />
                    </Box>
                </Box>

                <Box direction="column">
                    <Box direction="row" gap="5px">
                        <CheckBox
                            label="Use interests"
                            checked={useInterests}
                            onChange={handleUseInterestsChange}
                        />
                        <InfoIcon text="Whether or not to use the custom interests provided within the automator." />
                    </Box>
                </Box>
            </Form>
        </Box>
    );
});

export default Config;
