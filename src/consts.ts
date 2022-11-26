export const enum LocalStorageKey {
    INTERESTS = 'automator-interests',
    MESSAGES = 'automator-messages',
    TAB = 'automator-active-tab',
    WAIT_SECS = 'automator-wait-secs',
    RANDOMIZE = 'automator-randomize-wait-secs',
    START_WAIT_SECS = 'automator-start-wait-secs',
    USE_INTERESTS = 'automator-use-interests',
    STOP_AFTER_MINS = 'automator-stop-after-mins',
}

export const LATEST_RELEASE_URL =
    'https://api.github.com/repos/mstephen19/Omegle-Automator/releases/latest';

export const CURRENT_VERSION = chrome.runtime.getManifest().version;

export const WEBSTORE_LINK =
    'https://chrome.google.com/webstore/detail/omegle-automator/cjnledbijckhccgkhiamlpnpehfhcmkg';
