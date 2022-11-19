import ReactDOM from 'react-dom/client';
import { v4 } from 'uuid';
import Main from '../widget/Main';

const createRoot = () => {
    // Create the root element and assign it a randomized class name
    const elem = document.createElement('div');
    elem.className = `OmegleAutomator-${v4()}`;

    // Append the element to the top of the body tag and create a ReactDOM
    // root while returning it
    document.body.prepend(elem);
    return ReactDOM.createRoot(elem);
};

export const renderWidget = () => {
    const root = createRoot();
    root.render(<Main />);
};

export const sleep = (secs: number) => {
    return new Promise((resolve) => setTimeout(resolve, secs * 1e3));
};