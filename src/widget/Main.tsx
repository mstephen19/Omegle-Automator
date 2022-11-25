import { ThemeContext, Grommet } from 'grommet';
import { Toaster } from 'react-hot-toast';
import Widget from './Widget';
import { AutomatorProvider } from './components/Automator';

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
                    <Toaster
                        position="top-center"
                        toastOptions={{ duration: 3e3 }}
                    />
                    <Widget />
                </AutomatorProvider>
            </ThemeContext.Extend>
        </Grommet>
    );
};

export default Main;
