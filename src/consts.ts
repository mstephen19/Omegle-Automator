export const enum LocalStorageKey {
    INTERESTS = 'automator-interests',
    MESSAGES = 'automator-messages',
    TAB = 'automator-active-tab',
    WAIT_SECS = 'automator-wait-secs',
    START_WAIT_SECS = 'automator-start-wait-secs',
}

export const LATEST_RELEASE_URL =
    'https://api.github.com/repos/mstephen19/Omegle-Automator/releases/latest';

export const CURRENT_VERSION = chrome.runtime.getManifest().version;

export const WEBSTORE_LINK =
    'https://chrome.google.com/webstore/detail/omegle-automator/cjnledbijckhccgkhiamlpnpehfhcmkg';
