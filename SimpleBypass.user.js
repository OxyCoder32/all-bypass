// ==UserScript==
// @name         Simple bypass
// @namespace    by z3r0d4 and AI
// @version      0.0.1
// @description  Simple AI made bypass
// @author       Zero
// @match        https://linkzy.space/*
// @match        https://boost.ink/*
// @match        https://rekonise.com/*
// @match        https://mboost.me/*
// @match        https://link-unlock.com/*
// @match        https://socialwolvez.com/*
// @match        https://scwz.me/*
// @match        https://ldnesfspublic.org/*
// @match        https://linkunlocker.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    // --- Link-Unlock.com ---
    if (currentUrl.includes('link-unlock.com')) {
        const { fetch: originalFetch } = window;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            const url = args[0].toString();

            if (url.includes('api.link-unlock.com/u/') && !url.includes('/complete')) {
                const clone = response.clone();
                clone.json().then(async (data) => {
                    if (data?.success && data.unlock?.steps) {
                        const stepIds = data.unlock.steps.map(step => step.id);
                        const slug = url.split('/').pop();

                        setTimeout(async () => {
                            try {
                                const completeRes = await originalFetch(`https://api.link-unlock.com/u/${slug}/complete`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Accept': 'application/json'
                                    },
                                    body: JSON.stringify({ steps: stepIds })
                                });

                                const completeData = await completeRes.json();

                                if (completeData?.destinationUrl) {
                                    window.location.href = completeData.destinationUrl;
                                } else {
                                    console.error('[Bypass] destinationUrl dont found');
                                }
                            } catch (err) {
                                console.error('[Bypass] Error POST:', err);
                            }
                        }, 1000);
                    }
                }).catch(() => {});
            }
            return response;
        };
    }

    // --- Linkzy.space ---
    if (currentUrl.includes('linkzy.space')) {
        const { fetch: originalFetch } = window;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            if (args[0] && args[0].includes('/get-public-link')) {
                const clone = response.clone();
                clone.json().then(data => {
                    if (data?.destination_url) location.href = data.destination_url;
                }).catch(() => {});
            }
            return response;
        };

        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener('load', function() {
                if (this.responseURL.includes('/get-public-link')) {
                    try {
                        const { destination_url } = JSON.parse(this.responseText);
                        if (destination_url) location.href = destination_url;
                    } catch (e) {}
                }
            });
            originalOpen.apply(this, arguments);
        };
    }

    // --- Boost.ink ---
    if (currentUrl.includes('boost.ink')) {
        const boostObserver = new MutationObserver((_, obs) => {
            const script = document.querySelector('script[src*="/assets/js/unlock.js"][bufpsvdhmjybvgfncqfa]');
            if (script) {
                obs.disconnect();
                const encoded = script.getAttribute('bufpsvdhmjybvgfncqfa');
                if (encoded) location.href = atob(encoded);
            }
        });
        boostObserver.observe(document.documentElement, { childList: true, subtree: true });
    }

    // --- Rekonise ---
    if (currentUrl.includes('rekonise.com')) {
        let attempts = 0;

        const checkUnlock = async () => {
            const ngState = document.getElementById('ng-state');
            const slug = window.location.pathname.split('/').pop();
            const tokenMatch = ngState?.textContent?.match(/"unlock_token":"([^"]+)"/);

            if (!tokenMatch || !slug) return attempts >= 5 && clearInterval(interval);

            try {
                const res = await fetch(`https://api.rekonise.com/social-unlocks/${slug}/unlock?token=${tokenMatch[1]}`);
                const data = await res.json();

                if (data?.url) {
                    clearInterval(interval);
                    window.location.href = data.url;
                } else if (++attempts >= 5) {
                    clearInterval(interval);
                }
            } catch (err) {
                if (++attempts >= 5) clearInterval(interval);
            }
        };

        const interval = setInterval(checkUnlock, 2000);
    }

    // --- Mboost.me ---
    if (currentUrl.includes('mboost.me')) {
        const runMboost = () => {
            const scripts = document.querySelectorAll('script');
            for (const script of scripts) {
                if (script.textContent.includes('targeturl')) {
                    const match = script.textContent.match(/"targeturl":"([^"]+)"/);
                    if (match && match[1]) {
                        location.href = match[1].replace(/\\/g, '');
                        break;
                    }
                }
            }
        };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', runMboost);
        else runMboost();
    }

    // --- SocialWolvez / SCWZ ---
    if (currentUrl.includes('socialwolvez.com') || currentUrl.includes('scwz.me')) {
        let redirected = false;

        const runSocialWolvez = () => {
            if (redirected) return;

            const scripts = document.querySelectorAll('script');

            for (const script of scripts) {
                const content = script.textContent;
                if (!content) continue;

                const urlMatch = content.match(/\\"url\\":\\"(https?:\/\/[^\\"]+)\\"/);
                if (urlMatch && urlMatch[1]) {
                    const targetUrl = urlMatch[1];
                    if (!targetUrl.includes('socialwolvez.com') && !targetUrl.includes('scwz.me')) {
                        redirected = true;
                        window.location.href = targetUrl;
                        return;
                    }
                }

                const urlMatch2 = content.match(/\"url\":\"(https?:\/\/[^\"]+)\"/);
                if (urlMatch2 && urlMatch2[1]) {
                    const targetUrl = urlMatch2[1].replace(/\\/g, '');
                    if (!targetUrl.includes('socialwolvez.com') && !targetUrl.includes('scwz.me')) {
                        redirected = true;
                        window.location.href = targetUrl;
                        return;
                    }
                }
            }
        };

        setTimeout(runSocialWolvez, 1500);
    }

    // --- LDNESFSPUBLIC ---
    if (currentUrl.includes('ldnesfspublic.org')) {
        const urlParams = new URLSearchParams(window.location.search);
        const ccParam = urlParams.get('cc');

        if (ccParam) {
            try {
                const decodedData = atob(decodeURIComponent(ccParam));
                const jsonData = JSON.parse(decodedData);

                if (jsonData && jsonData.link) {
                    const targetUrl = decodeURIComponent(jsonData.link);
                    window.location.href = targetUrl;
                }
            } catch (e) {
                console.error('[Bypass] Error ldnesfspublic:', e);
            }
        }
    }

    // --- LinkUnlocker ---
    if (currentUrl.includes('linkunlocker.com')) {
        const runLinkUnlocker = async () => {
            const scripts = document.querySelectorAll('script');
            let unlockerId = null;
            let encryptedUrl = null;

            for (const script of scripts) {
                if (script.textContent && script.textContent.includes('self.__next_f.push')) {
                    const content = script.textContent;

                    const idMatch = content.match(/\\"_id\\":\\"69[a-f0-9]{22}\\"/);
                    if (!idMatch) {
                        const idMatch2 = content.match(/"_id":"(69[a-f0-9]{22})"/);
                        if (idMatch2) unlockerId = idMatch2[1];
                    } else {
                        unlockerId = idMatch[0].match(/69[a-f0-9]{22}/)[0];
                    }

                    const encMatch = content.match(/\\"_secureTarget5\\":\\"([^\\]+)\\"/);
                    if (!encMatch) {
                        const encMatch2 = content.match(/"_secureTarget5":"([^"]+)"/);
                        if (encMatch2) encryptedUrl = encMatch2[1];
                    } else {
                        encryptedUrl = encMatch[1];
                    }

                    if (unlockerId && encryptedUrl) {
                        break;
                    }
                }
            }

            if (unlockerId && encryptedUrl) {
                try {
                    const tokenRes = await fetch(window.location.href, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain;charset=UTF-8',
                            'Accept': 'text/x-component',
                            'Next-Action': '40aefacb2f77a22354545aacbb194a03ebfedad72b',
                            'Next-Router-State-Tree': encodeURIComponent('["",{"children":[[\"slug\",\"' + window.location.pathname.split('/').pop() + '\",\"d\"],{"children":["__PAGE__",{},null,null]},null,null]}],null,null,true]')
                        },
                        body: JSON.stringify([unlockerId])
                    });

                    const tokenText = await tokenRes.text();
                    let tokenMatch = tokenText.match(/"token":"([^"]+)"/);
                    if (!tokenMatch) {
                        tokenMatch = tokenText.match(/token\\":\\"([^\\"]+)\\"/);
                    }

                    if (!tokenMatch) {
                        return;
                    }

                    const requestToken = tokenMatch[1];

                    const finalRes = await fetch(window.location.href, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain;charset=UTF-8',
                            'Accept': 'text/x-component',
                            'Next-Action': '403f66e55109b46b722c408c17a17267d20e0393c2',
                            'Next-Router-State-Tree': encodeURIComponent('["",{"children":[[\"slug\",\"' + window.location.pathname.split('/').pop() + '\",\"d\"],{"children":["__PAGE__",{},null,null]},null,null]}],null,null,true]')
                        },
                        body: JSON.stringify([{
                            encryptedUrl: encryptedUrl,
                            requestToken: requestToken,
                            unlockerId: unlockerId,
                            useAdDestination: false,
                            adDestination: ""
                        }])
                    });

                    const finalText = await finalRes.text();

                    let urlMatch = finalText.match(/"url":"([^"]+)"/);
                    if (!urlMatch) {
                        urlMatch = finalText.match(/url\\":\\"([^\\"]+)\\"/);
                    }

                    if (urlMatch && urlMatch[1]) {
                        const destinationUrl = urlMatch[1].replace(/\\/g, '');
                        window.location.href = destinationUrl;
                    } else {
                        console.log('[Bypass] URL not found');
                    }
                } catch (err) {
                    console.error('[Bypass] Error LinkUnlocker:', err);
                }
            } else {
                console.log('[Bypass] Dates nor found');
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runLinkUnlocker);
        } else {
            runLinkUnlocker();
        }
    }
})();
