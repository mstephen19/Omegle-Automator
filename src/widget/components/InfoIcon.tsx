import { CircleInformation } from 'grommet-icons';
import { Box, Text } from 'grommet';
import { useState, useCallback } from 'react';

export const InfoIcon = ({ text }: { text: string }) => {
    const [hovering, setHovering] = useState(false);

    const handleMouseOver = useCallback(() => setHovering(true), []);
    const handleMouseOut = useCallback(() => setHovering(false), []);

    return (
        <Box flex justify="center" style={{ maxWidth: '20px' }}>
            <CircleInformation
                size="20px"
                cursor="help"
                color={'#444444'}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
            />

            {hovering && (
                <Box
                    style={{
                        position: 'absolute',
                        width: 'fit-content',
                        minHeight: '20px',
                        borderRadius: '10px',
                        zIndex: 9e10,
                        transform: 'translateX(20px)',
                        maxWidth: '200px',
                    }}
                    background="grey"
                    pad="xsmall"
                >
                    <Text color="#FFF" style={{ width: 'fit-content' }}>
                        {text}
                    </Text>
                </Box>
            )}
        </Box>
    );
};
