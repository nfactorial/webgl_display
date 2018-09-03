import * as SystemEvents from './system_events';

/**
 * This file provides a wrapper around the FullScreen API that may be available on the client device.
 * Not all devices support full-screen mode, you should check the full-screen API is available by calling the
 * isAvailable method supplied by this module.
 *
 * Some devices, such as iOS do not support the full-screen API but may present the rendered surface as fulls-screen
 * to the user automatically.
 */

let fullScreenStatus = false;

export const Events = {
    FullScreenChanged: 'fullscreen:changed',
};

/**
 * Determines whether or not the application is currently in full-screen mode.
 * @returns {boolean} True if the application is in full-screen, otherwise false.
 */
export function isFullScreen() {
    return fullScreenStatus;
}

/**
 * Retrieves the HTML element the browser considers full-screen.
 * @returns {Element|null} The full-screen element.
 */
function getFullScreenElement() {
    if (document.fullscreenElement) {
        return document.fullscreenElement;
    }

    if (document.webkitFullscreenElement) {
        return document.webkitFullscreenElement;
    }

    if (document.mozFullScreenElement) {
        return document.mozFullScreenElement;
    }

    if (document.msFullscreenElement) {
        return document.msFullscreenElement;
    }

    return null;
}

/**
 * Asks the browser to make the specified element full-screen.
 * @param {HTMLElement} element - The HTML element to be made full-screen
 * @returns {boolean} True if the full-screen operation was requested otherwise false.
 */
function internalRequestFullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
        return true;
    }

    if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
        return true;
    }

    if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
        return true;
    }

    if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
        return true;
    }

    return false;
}

/**
 * Requests the API to enable full-screen mode using the supplied element.
 * @param {HTMLElement} element - The HTML element to be used for full-screen mode.
 */
export function enterFullScreen(element) {
    if (!element) {
        throw new Error('No element supplied for full-screen operation.');
    }

    return internalRequestFullScreen(element);
}

/**
 * Requests the API to disable full-screen mode using the supplied element.
 * @returns {boolean} True if the request was made otherwise false.
 */
export function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
        return true;
    }

    if (document.cancelFullScreen) {
        document.cancelFullScreen();
        return true;
    }

    if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
        return true;
    }

    if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
        return true;
    }

    return false;
}

/**
 * Determines whether or not the current browser supports the full-screen API.
 * @returns {boolean} True if the browser supports the full-screen API otherwise false.
 */
export function isAvailable() {
    if (document.exitFullscreen) {
        return true;
    }

    if (document.cancelFullScreen) {
        return true;
    }

    if (document.mozCancelFullScreen) {
        return true;
    }

    if (document.webkitCancelFullScreen) {
        return true;
    }

    return false;
}

/**
 * Event handler invoked when the fullscreen status of the application has changed.
 */
function onFullScreenChange() {
    if (getFullScreenElement()) {
        if (!fullScreenStatus) {
            fullScreenStatus = true;
            // TODO: emit(Events.FullScreenChanged);
        }
    } else if (fullScreenStatus) {
        fullScreenStatus = false;
        // TODO: emit(Events.FullScreenChanged);
    }
}

document.addEventListener(SystemEvents.FULLSCREEN_CHANGE_EVENT, onFullScreenChange, false);
document.addEventListener(SystemEvents.WEBKIT_FULLSCREEN_CHANGE_EVENT, onFullScreenChange, false);
document.addEventListener(SystemEvents.MOZILLA_FULLSCREEN_CHANGE_EVENT, onFullScreenChange, false);
document.addEventListener(SystemEvents.MS_FULLSCREEN_CHANGE_EVENT, onFullScreenChange, false);
