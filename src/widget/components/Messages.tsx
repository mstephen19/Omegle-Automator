import { Box, Form, TextArea, Button, Paragraph } from 'grommet';
import { Close } from 'grommet-icons';
import { useState, useRef, useCallback, memo } from 'react';
import { v4 } from 'uuid';
import { LocalStorageKey } from '../../consts';
import { useLocalStorage } from '../hooks';

import type {
    MouseEventHandler,
    EventHandler,
    KeyboardEventHandler,
    ChangeEventHandler,
    DragEventHandler,
} from 'react';
import type { MessageArray } from '../../types';

const Messages = memo(() => {
    const formRef = useRef<HTMLFormElement>(null);
    const [value, setValue] = useState('');
    const [messages, setMessages] = useLocalStorage<MessageArray>(
        LocalStorageKey.MESSAGES,
        []
    );

    const handleRemove: MouseEventHandler<
        HTMLAnchorElement & HTMLButtonElement
    > = useCallback((e) => {
        const { index } = e.currentTarget.dataset;

        if (!index) return;

        setMessages((prev) => {
            const copy = [...prev];
            // Remove the item at that index
            copy.splice(+index, 1);
            return copy;
        });
    }, []);

    const handleSubmit = useCallback(() => {
        if (!value) return;

        setMessages((prev) => {
            return [...prev, { id: v4(), text: value }];
        });

        setValue('');
    }, [value]);

    const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> =
        useCallback((e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit?.();
            }
        }, []);

    const handleChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
        (e) => {
            setValue((e.currentTarget as HTMLTextAreaElement).value);
        },
        []
    );

    const handleDrop: DragEventHandler<HTMLDivElement> = useCallback((e) => {
        prevent(e);

        const oldIndex = e.dataTransfer.getData('text/plain');
        const { index: newIndex } = (e.target as HTMLLIElement).dataset;

        if (!newIndex) return;

        setMessages((prev) => {
            // Copy the current messages array
            const copy = [...prev];
            // Copy the dragged item
            const item = copy[+oldIndex];
            // Move the item dropped upon over to the
            // old position of the dragged item
            copy.splice(+oldIndex, 1, copy[+newIndex]);
            // Move the dragged item to the position on
            // which it was dropped
            copy.splice(+newIndex, 1, item);

            return copy;
        });
    }, []);

    const prevent: EventHandler<any> = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    return (
        <Box direction="column" pad="small">
            <Form
                ref={formRef}
                style={{ display: 'flex', gap: '5px' }}
                onSubmit={handleSubmit}
            >
                <TextArea
                    name="interests"
                    resize="vertical"
                    placeholder="ex. youtube"
                    value={value}
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    style={{ maxHeight: '200px', minHeight: '50px' }}
                />
                <Button
                    type="submit"
                    label="Add"
                    disabled={!value}
                    style={{ maxHeight: '50px' }}
                />
            </Form>
            <Box
                wrap
                direction="column"
                as="ul"
                style={{ listStyle: 'none', marginTop: '6px', marginBottom: 0 }}
                gap="xsmall"
                pad="none"
            >
                {messages.map(({ text, id }, index) => {
                    return (
                        <Box
                            background="grey"
                            key={id}
                            data-index={index}
                            draggable
                            pad="small"
                            direction="row"
                            style={{
                                cursor: 'move',
                                userSelect: 'none',
                                borderRadius: '5px',
                            }}
                            onDragStart={(e) => {
                                e.dataTransfer.setData(
                                    'text/plain',
                                    index.toString()
                                );
                            }}
                            onDrop={handleDrop}
                            onDragEnter={prevent}
                            onDragOver={prevent}
                        >
                            <Paragraph
                                data-index={index}
                                margin="none"
                                style={{
                                    width: '100%',
                                    wordBreak: 'break-all',
                                }}
                            >
                                {text}
                            </Paragraph>
                            <Button onClick={handleRemove} data-index={index}>
                                <Close />
                            </Button>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
});

export default Messages;
