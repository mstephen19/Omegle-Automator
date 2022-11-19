import { Box, Form, TextInput, Button, Tag } from 'grommet';
import { useState, memo, useCallback } from 'react';
import { v4 } from 'uuid';
import { useLocalStorage } from '../hooks';
import { LocalStorageKey } from '../../consts';

import type { InterestMap } from '../../types';
import type { MouseEventHandler, ChangeEventHandler } from 'react';

const Interests = memo(() => {
    const [value, setValue] = useState('');
    const [interests, setInterests] = useLocalStorage<InterestMap>(
        LocalStorageKey.INTERESTS,
        {}
    );

    const handleSubmit = useCallback(() => {
        if (!value) return;

        setInterests((prev) => ({ ...prev, [v4()]: value }));
        setValue('');
    }, [value]);

    const handleChange: ChangeEventHandler<HTMLInputElement> = useCallback(
        (e) => {
            setValue(e.target.value);
        },
        []
    );

    const handleRemove: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
        const { id } = (e.currentTarget.parentElement as HTMLDivElement)
            .dataset;

        setInterests((prev) => {
            const { [id!]: toRemove, ...rest } = prev;
            return rest;
        });
    }, []);

    return (
        <Box direction="column" pad="small">
            <Form
                style={{ display: 'flex', gap: '5px' }}
                onSubmit={handleSubmit}
            >
                <TextInput
                    name="interests"
                    placeholder="ex. youtube"
                    value={value}
                    onChange={handleChange}
                />
                <Button type="submit" label="Add" disabled={!value} />
            </Form>
            <Box wrap pad="xxsmall" direction="row">
                {interests &&
                    Object.entries(interests).map(([id, text]) => {
                        return (
                            <Box pad="xxsmall" key={id}>
                                <Tag
                                    value={text}
                                    data-id={id}
                                    onRemove={handleRemove}
                                />
                            </Box>
                        );
                    })}
            </Box>
        </Box>
    );
});

export default Interests;