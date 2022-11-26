import { createContext, memo, useContext, useEffect, useState } from 'react';
import { LocalStorageKey } from '../../consts';
import { randomNumber, sleep } from '../../utils';

import type { ReactNode, SetStateAction, Dispatch } from 'react';
import type { InterestMap, MessageArray } from '../../types';

export const getMessages = () => {
    const value = localStorage.getItem(LocalStorageKey.MESSAGES);

    return (value ? JSON.parse(value) : []) as MessageArray;
};

const getStopAfterMinutes = () => {
    const value = localStorage.getItem(LocalStorageKey.STOP_AFTER_MINS);

    return value && JSON.parse(value) !== null ? +value : 0;
};

const getStartWaitSecs = () => {
    const value = localStorage.getItem(LocalStorageKey.START_WAIT_SECS);

    return (value ? JSON.parse(value) : 0) as number;
};

const getUseInterests = () => {
    const value = localStorage.getItem(LocalStorageKey.USE_INTERESTS);

    return (value ? JSON.parse(value) : true) as boolean;
};

const getWaitSecs = () => {
    const randomize = JSON.parse(
        localStorage.getItem(LocalStorageKey.RANDOMIZE) ?? 'false'
    ) as boolean;

    if (randomize) return randomNumber(3, 10);

    const value = localStorage.getItem(LocalStorageKey.WAIT_SECS);

    return (value ? JSON.parse(value) : 3) as number;
};

const getInterests = () => {
    const value = localStorage.getItem(LocalStorageKey.INTERESTS);

    return (value ? JSON.parse(value) : {}) as InterestMap;
};

const populateInterests = () => {
    const input = document.querySelector('.newtopicinput') as HTMLInputElement;
    if (!input) return;

    // Delete old interests (if any)
    for (const tag of document.querySelectorAll('.topictagdelete')) {
        (tag as HTMLSpanElement).click();
    }

    // Grab interests from LocalStorage
    const interests = getInterests();

    // Add all new interests
    for (const interest of Object.values(interests)) {
        input.value = interest;
        input.dispatchEvent(
            new KeyboardEvent('keydown', {
                code: 'Enter',
                key: 'Enter',
                charCode: 13,
                keyCode: 13,
                view: window,
                bubbles: true,
            })
        );
    }
};

/**
 * Determines whether or not the chat session is currently open. If it is,
 * the function will return `true`, otherwise, `false`.
 */
const isInChat = () => !!document.querySelector('div.chatmsgwrapper');

const startSession = () => {
    const button = document.querySelector('#textbtn') as HTMLButtonElement;

    if (!button) return;

    // Click the "Text" button
    button.click();

    // Agree to the terms by clicking the checkboxes
    for (const checkbox of document.querySelectorAll(
        'p > label > input[type="checkbox"]'
    ) as NodeListOf<HTMLInputElement>) {
        checkbox.click();
        checkbox.checked = true;
    }

    // Click the confirm button to start the chat
    (
        document.querySelector(
            'input[value="Confirm & continue"]'
        ) as HTMLButtonElement
    ).click();
};

const newButtonPresent = () => {
    // Find the disconnect button
    const button = document.querySelector(
        'button.disconnectbtn'
    ) as HTMLButtonElement;

    // If the text node contains "New", return the button
    if (button.childNodes?.[0]?.textContent?.includes('New')) return button;

    // Otherwise, return false
    return false;
};

const clickNewButton = () => {
    const button = newButtonPresent();
    if (!button) return;
    button?.click();
};

const canType = () => {
    if (!isInChat()) return false;
    return !(document.querySelector('textarea.chatmsg') as HTMLTextAreaElement)
        .disabled;
};

/**
 * Wait for the ability to type.
 */
const waitToType = async (): Promise<void> => {
    if (canType()) return;
    // wait for just a quarter of a second before clicking again
    await sleep(0.5);
    return waitToType();
};

// Will eventually for-await loop through this generator function
// on each iteration will check if we've been cancelled on or not.
// if we have, then we will break out of the loop.
const sendMessages = async function* () {
    for (const message of getMessages()) {
        // "Type" the message in
        const elem = document.querySelector(
            'textarea.chatmsg'
        ) as HTMLTextAreaElement;
        elem.value = message.text;

        // Click the send button
        (document.querySelector('button.sendbtn') as HTMLButtonElement).click();
        await sleep(getWaitSecs());
        yield;
    }

    // end the chat
    const quit = document.querySelector(
        'button.disconnectbtn'
    ) as HTMLButtonElement;

    for (let i = 1; i <= 3; i++) {
        await sleep(0.25);
        quit.click();
    }
    yield 'END';
};

const AutomatorContext = createContext<
    [boolean, Dispatch<SetStateAction<boolean>>]
>([false, () => {}]);

export const useAutomatorContext = () => useContext(AutomatorContext);

export const AutomatorProvider = ({ children }: { children: ReactNode }) => {
    const [status, setStatus] = useState(false);

    return (
        <AutomatorContext.Provider value={[status, setStatus]}>
            {children && children}
        </AutomatorContext.Provider>
    );
};

const Automator = memo(() => {
    const [started, setStarted] = useAutomatorContext();

    useEffect(() => {
        // If we don't want to start, do nothing.
        if (!started) return;

        // Set this value to true when the component is rerendered.
        let cancelled = false;

        // Create a timeout variable and assign a timeout to it only if the
        // user provided a minutes value above 0.
        let timeout: NodeJS.Timeout;
        const stopAfterMins = getStopAfterMinutes();
        if (stopAfterMins > 0) {
            timeout = setTimeout(() => {
                cancelled = true;
                setStarted(false);
            }, stopAfterMins * 6e4);
        }

        // If a chat session is not open already AND the user wants to
        // use the custom interests, fill out the interests
        if (!isInChat() && getUseInterests()) {
            populateInterests();
        }

        // Then start the session no matter what
        if (!isInChat()) startSession();

        (async () => {
            // Check on every iteration whether or not the sequence has
            // been cancelled.
            while (!cancelled) {
                // If the "New" button is present, click it.
                clickNewButton();
                // Wait for an open chat
                await waitToType();
                // Wait for the number of user-provided pre-chat wait seconds.
                await sleep(getStartWaitSecs());
                // If the workflow was cancelled during the start wait time, exit out completely.
                if (cancelled) return;
                // If the new button is present (meaning the bot was disconnected on
                // during the start-wait time), don't do anything else and start the
                // workflow again.
                if (newButtonPresent()) continue;

                // Send messages
                for await (const x of sendMessages()) {
                    // After each message has been sent...
                    // If the sequence was cancelled, immediately return out, stopping
                    // the workflow.
                    if (cancelled) return;

                    // If the generator finished its cycle, don't run any checks and leave the loop.
                    if (x === 'END') break;

                    // After sending each message, check if we can type or not.
                    // If we can't type, we've been disconnected on. Click the disconnect
                    // button once, then break out.
                    if (!canType()) {
                        (
                            document.querySelector(
                                'button.disconnectbtn'
                            ) as HTMLButtonElement
                        ).click();
                        break;
                    }
                }
            }
        })();

        return () => {
            cancelled = true;
            if (timeout) clearTimeout(timeout);
        };
    }, [started]);

    return <></>;
});

export default Automator;
