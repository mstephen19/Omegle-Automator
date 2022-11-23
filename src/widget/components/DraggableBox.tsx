import Draggable from 'react-draggable';
import { useState, useCallback } from 'react';
import { Card, Header, Text, Button, Tip } from 'grommet';
import { Close, Add } from 'grommet-icons';
import { useLocalStorage } from '../hooks';

import type { DraggableEventHandler } from 'react-draggable';
import type { ReactNode } from 'react';

const defaultPositions = { x: 25, y: 25 };

type DraggableBoxProps = {
    title: string;
    children?: ReactNode;
    alwaysShow?: ReactNode;
    hideContent?: boolean;
};

const DraggableBox = ({
    children,
    title,
    alwaysShow,
    hideContent,
}: DraggableBoxProps) => {
    const [dragging, setDragging] = useState(false);
    const [hide, setHide] = useLocalStorage(
        `draggable-hide-${title.toLowerCase().replace(/\s/g, '-')}`,
        false
    );
    const [positions, setPositions] = useLocalStorage(
        `draggable-position-${title.toLowerCase().replace(/\s/g, '-')}`,
        defaultPositions
    );

    const handleDrag: DraggableEventHandler = useCallback(
        () => setDragging(true),
        []
    );

    const handleDragStop: DraggableEventHandler = useCallback((_, { x, y }) => {
        setPositions({ x, y });
        setDragging(false);
    }, []);

    return (
        <>
            <Tip
                content={
                    <Text
                        textAlign="center"
                        style={{
                            maxWidth: '250px',
                        }}
                    >
                        Lost the widget somehow? Click this button to move it
                        back to its original position!
                    </Text>
                }
            >
                <Button
                    primary
                    style={{
                        position: 'fixed',
                        zIndex: 9e7,
                        top: '25px',
                        left: '25px',
                    }}
                    label="Find widget"
                    onClick={() => setPositions(defaultPositions)}
                />
            </Tip>
            <Draggable
                handle=".drag-handle"
                defaultPosition={positions}
                position={positions}
                scale={1}
                onDrag={handleDrag}
                onStop={handleDragStop}
            >
                <Card
                    style={{
                        position: 'fixed',
                        zIndex: 9e8,
                        width: '350px',
                        height: 'auto',
                        maxHeight: '500px',
                        boxShadow: '0px 0px 4px',
                        overflow: 'visible',
                    }}
                    background="light"
                    animation="fadeIn"
                >
                    <Header
                        className="drag-handle"
                        style={{
                            userSelect: dragging ? 'none' : 'text',
                            cursor: 'move',
                            width: '100%',
                            minHeight: '50px',
                            height: '50px',
                            borderTopLeftRadius: 'inherit',
                            borderTopRightRadius: 'inherit',
                        }}
                        background="grey"
                        flex
                        align="center"
                        pad="small"
                    >
                        <Text>{title}</Text>
                        {!hide && !hideContent ? (
                            <Close
                                onClick={() => {
                                    setHide(true);
                                }}
                                style={{ cursor: 'pointer' }}
                            />
                        ) : (
                            <Add
                                onClick={() => {
                                    if (hideContent) return;
                                    setHide(false);
                                }}
                                style={{ cursor: 'pointer' }}
                            />
                        )}
                    </Header>
                    <>
                        {!hide && !hideContent && children}
                        {alwaysShow && alwaysShow}
                    </>
                </Card>
            </Draggable>
        </>
    );
};

export default DraggableBox;
