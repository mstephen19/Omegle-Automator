import { AutomatorProvider } from './components/Automator';
import { ThemeContext, Grommet } from 'grommet';
import Widget from './Widget';

const Main = () => {
    return (
        <Grommet>
            <ThemeContext.Extend
                value={{
                    global: {
                        colors: {
                            dark: '#132C33',
                            grey: '#132C33',
                            blue: '#51C4D3',
                            light: '#D8E3E7',
                        },
                    },
                }}
            >
                <AutomatorProvider>
                    <Widget />
                </AutomatorProvider>
            </ThemeContext.Extend>
        </Grommet>
    );
};

export default Main;
