import { Box, Form, RangeInput, Text } from 'grommet';
import { memo, useCallback } from 'react';
import { useLocalStorage } from '../hooks';
import { LocalStorageKey } from '../../consts';

import type { ChangeEventHandler } from 'react';

const Config = memo(() => {
    const [waitSecs, setWaitSecs] = useLocalStorage(
        LocalStorageKey.WAIT_SECS,
        3
    );

    const handleRangeChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            setWaitSecs(+e.target.value);
        },
        []
    );

    return (
        <Box direction="column" pad="small">
            <Form
                style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}
            >
                <Box direction="column">
                    <label htmlFor="wait-between">Wait-between</label>
                    <Box direction="row">
                        <RangeInput
                            id="wait-between"
                            max={15}
                            min={1}
                            step={1}
                            value={waitSecs}
                            onChange={handleRangeChange}
                        />
                        <Text style={{ width: '20px', textAlign: 'center' }}>
                            {waitSecs}
                        </Text>
                    </Box>
                </Box>
            </Form>
        </Box>
    );
});

export default Config;
