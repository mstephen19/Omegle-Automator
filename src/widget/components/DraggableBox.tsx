import Draggable from 'react-draggable';
import { useState, useCallback, useRef } from 'react';
import { Card, Header, Text, Button, Tip, Box } from 'grommet';
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
    const cardRef = useRef<HTMLDivElement>(null);
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

    const handlePositions = useCallback((x: number, y: number) => {
        const rect = cardRef.current!.getBoundingClientRect()!;
        const rightX = rect.left + rect.width;
        const bottomY = rect.top + rect.height;

        setPositions({
            x:
                // Disallow the card from going outside of the page on the left
                x < 0
                    ? 5
                    : // As well as on the right
                    rightX > window.innerWidth
                    ? window.innerWidth - rect.width - 5
                    : x,
            y:
                y < 0
                    ? 5
                    : bottomY > window.innerHeight
                    ? window.innerHeight - rect.height - 5
                    : y,
        });
    }, []);

    const handleDragStop: DraggableEventHandler = useCallback((_, { x, y }) => {
        handlePositions(x, y);
        setDragging(false);
    }, []);

    return (
        <>
            <Tip
                plain={true}
                content={
                    <Box
                        pad="xsmall"
                        style={{
                            borderRadius: '10px',
                            background: 'rgba(18,44,51,0.75)',
                        }}
                    >
                        <Text
                            textAlign="center"
                            style={{
                                maxWidth: '250px',
                            }}
                            color="white"
                        >
                            Lost the widget somehow? Click this button to move
                            it back to its original position!
                        </Text>
                    </Box>
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
                    ref={cardRef}
                    style={{
                        position: 'fixed',
                        zIndex: 9e8,
                        width: 'clamp(350px, 30vw , 400px)',
                        minWidth: '300px',
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
                        <Text weight="bold">{title}</Text>
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
