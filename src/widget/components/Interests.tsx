import { Box, Form, TextInput, Button, Tag } from 'grommet';
import { useState, memo, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useLocalStorage } from '../hooks';
import { LocalStorageKey } from '../../consts';
import { stringToId } from '../../utils';

import type { MouseEventHandler, ChangeEventHandler } from 'react';
import type { InterestMap } from '../../types';

const Interests = memo(() => {
    const [value, setValue] = useState('');
    const [interests, setInterests] = useLocalStorage<InterestMap>(
        LocalStorageKey.INTERESTS,
        {}
    );

    const handleSubmit = useCallback(() => {
        if (!value) return;

        const trimmed = value.trim();
        const id = stringToId(trimmed);

        // If the interest hasn't already been added, go ahead and add it.
        if (!(id in interests)) {
            setInterests((prev) => ({ ...prev, [id]: trimmed }));
        } else toast.error(`Already added the interest "${trimmed}"`);

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
                    maxLength={25}
                    autoFocus
                />
                <Button
                    type="submit"
                    label="Add"
                    disabled={!value}
                    style={{ height: 'fit-content' }}
                />
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
