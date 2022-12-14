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

export const stringToId = (str: string) => {
    return str
        .trim()
        .split('')
        .reduce((acc, curr) => acc.concat(curr.charCodeAt(0).toString()), '');
};

export const randomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const isSpintax = (str: string) => /{(?:[^{}|]+\|?)+}/g.test(str);

const getSpintaxItems = (str: string) => str.replace(/[{}]/g, '').split('|');

export const stringFromSpintax = (input: string) => {
    if (!isSpintax(input)) return input;

    const matched = input.split(
        /(?<={(?:[^{}|]+\|?)+})|(?={(?:[^{}|]+\|?)+})/g
    );
    return matched.reduce((final, item) => {
        if (!isSpintax(item)) return final.concat(item);
        const items = getSpintaxItems(item);
        return final.concat(items[Math.floor(Math.random() * items.length)]);
    }, '');
};
