// ==UserScript==
// @name         Simple bypass
// @namespace    by z3r0d4 and AI
// @version      0.0.2
// @description  Simple AI made bypass with status panel
// @author       Zero
// @match        https://linkzy.space/*
// @match        https://boost.ink/*
// @match        https://rekonise.com/*
// @match        https://rekonise.org/*
// @match        https://rkns.link/*
// @match        https://mboost.me/*
// @match        https://link-unlock.com/*
// @match        https://socialwolvez.com/*
// @match        https://scwz.me/*
// @match        https://ldnesfspublic.org/*
// @match        https://linkunlocker.com/*
// @match        https://robloxscripts.gg/*
// @match        https://scriptpastebins.com/*
// @match        https://bstlar.com/*
// @match        https://go.linkify.ru/*
// @match        https://lockr.so/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    // --- Panel ---
    const statusPanel = document.createElement('div');
    statusPanel.id = 'bypass-status-panel';
    statusPanel.innerHTML = `
        <style>
            #bypass-status-panel {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                color: #00ff88;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                font-weight: bold;
                padding: 12px 24px;
                border-radius: 30px;
                z-index: 999999;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                border: 1px solid #00ff88;
                backdrop-filter: blur(5px);
                text-align: center;
                min-width: 250px;
                pointer-events: none;
                animation: pulse 2s infinite;
            }
            #bypass-status-panel .status-icon {
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: #ffaa00;
                margin-right: 8px;
                animation: blink 1s infinite;
            }
            #bypass-status-panel .status-text {
                letter-spacing: 1px;
            }
            #bypass-status-panel .status-detail {
                font-size: 11px;
                color: #aaaaaa;
                margin-top: 4px;
                font-weight: normal;
            }
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }
            @keyframes pulse {
                0%, 100% { box-shadow: 0 4px 15px rgba(0,255,136,0.2); }
                50% { box-shadow: 0 4px 20px rgba(0,255,136,0.5); }
            }
        </style>
        <div style="display: flex; align-items: center; gap: 8px;">
            <div class="status-icon"></div>
            <div class="status-text">🔓 BYPASSING PLEASE WAIT...</div>
        </div>
        <div class="status-detail" id="bypass-status-detail">Initializing...</div>
    `;

    function updateStatus(message, isError = false) {
        const panel = document.getElementById('bypass-status-panel');
        if (panel) {
            const detailEl = panel.querySelector('#bypass-status-detail');
            if (detailEl) {
                detailEl.textContent = message;
                detailEl.style.color = isError ? '#ff6666' : '#aaaaaa';
            }
            const iconEl = panel.querySelector('.status-icon');
            if (iconEl) {
                iconEl.style.backgroundColor = isError ? '#ff4444' : '#00ff88';
                iconEl.style.animation = isError ? 'none' : 'blink 1s infinite';
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            document.body.appendChild(statusPanel);
        });
    } else {
        document.body.appendChild(statusPanel);
    }

    function redirectWithStatus(url, message) {
        updateStatus(message);
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }

    // --- Link-Unlock.com ---
    if (currentUrl.includes('link-unlock.com')) {
        updateStatus('Intercepting Link-Unlock API...');
        const { fetch: originalFetch } = window;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            const url = args[0].toString();

            if (url.includes('api.link-unlock.com/u/') && !url.includes('/complete')) {
                updateStatus('Processing unlock steps...');
                const clone = response.clone();
                clone.json().then(async (data) => {
                    if (data?.success && data.unlock?.steps) {
                        const stepIds = data.unlock.steps.map(step => step.id);
                        const slug = url.split('/').pop();

                        setTimeout(async () => {
                            try {
                                updateStatus('Completing unlock...');
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
                                    redirectWithStatus(completeData.destinationUrl, 'Redirecting to destination...');
                                } else {
                                    updateStatus('Destination URL not found', true);
                                }
                            } catch (err) {
                                updateStatus('Error completing unlock', true);
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
        updateStatus('Intercepting Linkzy API...');
        const { fetch: originalFetch } = window;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            if (args[0] && args[0].includes('/get-public-link')) {
                updateStatus('Getting public link...');
                const clone = response.clone();
                clone.json().then(data => {
                    if (data?.destination_url) {
                        redirectWithStatus(data.destination_url, 'Redirecting...');
                    }
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
                        if (destination_url) {
                            redirectWithStatus(destination_url, 'Redirecting...');
                        }
                    } catch (e) {}
                }
            });
            originalOpen.apply(this, arguments);
        };
    }

    // --- Boost.ink ---
    if (currentUrl.includes('boost.ink')) {
        updateStatus('Monitoring Boost.ink...');
        const boostObserver = new MutationObserver((_, obs) => {
            const script = document.querySelector('script[src*="/assets/js/unlock.js"][bufpsvdhmjybvgfncqfa]');
            if (script) {
                obs.disconnect();
                const encoded = script.getAttribute('bufpsvdhmjybvgfncqfa');
                if (encoded) {
                    const url = atob(encoded);
                    redirectWithStatus(url, 'Decoded redirect URL...');
                }
            }
        });
        boostObserver.observe(document.documentElement, { childList: true, subtree: true });
    }

    // --- Rekonise ---
    if (currentUrl.includes('rekonise.com') || currentUrl.includes('rekonise.org') || currentUrl.includes('rkns.link')) {
        updateStatus('Processing Rekonise...');
        let attempts = 0;

        const checkUnlock = async () => {
            const ngState = document.getElementById('ng-state');
            const slug = window.location.pathname.split('/').pop();
            const tokenMatch = ngState?.textContent?.match(/"unlock_token":"([^"]+)"/);

            if (!tokenMatch || !slug) {
                if (++attempts >= 5) {
                    updateStatus('Failed to unlock', true);
                    clearInterval(interval);
                }
                return;
            }

            try {
                updateStatus(`Attempting unlock (${attempts + 1}/5)...`);
                const res = await fetch(`https://api.rekonise.com/social-unlocks/${slug}/unlock?token=${tokenMatch[1]}`);
                const data = await res.json();

                if (data?.url) {
                    clearInterval(interval);
                    redirectWithStatus(data.url, 'Unlocked! Redirecting...');
                } else if (++attempts >= 5) {
                    updateStatus('Max attempts reached', true);
                    clearInterval(interval);
                }
            } catch (err) {
                if (++attempts >= 5) {
                    updateStatus('Error during unlock', true);
                    clearInterval(interval);
                }
            }
        };

        const interval = setInterval(checkUnlock, 2000);
    }

    // --- Mboost.me ---
    if (currentUrl.includes('mboost.me')) {
        updateStatus('Scanning Mboost...');
        const runMboost = () => {
            const scripts = document.querySelectorAll('script');
            for (const script of scripts) {
                if (script.textContent.includes('targeturl')) {
                    const match = script.textContent.match(/"targeturl":"([^"]+)"/);
                    if (match && match[1]) {
                        redirectWithStatus(match[1].replace(/\\/g, ''), 'Target URL found...');
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
        updateStatus('Analyzing SocialWolvez...');
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
                        redirectWithStatus(targetUrl, 'Destination found...');
                        return;
                    }
                }

                const urlMatch2 = content.match(/\"url\":\"(https?:\/\/[^\"]+)\"/);
                if (urlMatch2 && urlMatch2[1]) {
                    const targetUrl = urlMatch2[1].replace(/\\/g, '');
                    if (!targetUrl.includes('socialwolvez.com') && !targetUrl.includes('scwz.me')) {
                        redirected = true;
                        redirectWithStatus(targetUrl, 'Destination found...');
                        return;
                    }
                }
            }
        };

        setTimeout(runSocialWolvez, 1500);
    }

    // --- LDNESFSPUBLIC ---
    if (currentUrl.includes('ldnesfspublic.org')) {
        updateStatus('Decoding LDNESFSPUBLIC...');
        const urlParams = new URLSearchParams(window.location.search);
        const ccParam = urlParams.get('cc');

        if (ccParam) {
            try {
                const decodedData = atob(decodeURIComponent(ccParam));
                const jsonData = JSON.parse(decodedData);

                if (jsonData && jsonData.link) {
                    const targetUrl = decodeURIComponent(jsonData.link);
                    redirectWithStatus(targetUrl, 'Decoded link, redirecting...');
                }
            } catch (e) {
                updateStatus('Error decoding', true);
            }
        }
    }

    // --- LinkUnlocker ---
    if (currentUrl.includes('linkunlocker.com')) {
        updateStatus('Processing LinkUnlocker...');
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
                    updateStatus('Getting token...');
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
                        updateStatus('Token not found', true);
                        return;
                    }

                    const requestToken = tokenMatch[1];
                    updateStatus('Unlocking...');

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
                        redirectWithStatus(destinationUrl, 'Redirecting...');
                    } else {
                        updateStatus('URL not found in response', true);
                    }
                } catch (err) {
                    updateStatus('Error during unlock', true);
                }
            } else {
                updateStatus('Required data not found', true);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runLinkUnlocker);
        } else {
            runLinkUnlocker();
        }
    }

    // --- RobloxScripts.gg ---
    if (currentUrl.includes('robloxscripts.gg')) {
        updateStatus('Fetching RobloxScripts...');
        const pathMatch = window.location.pathname.match(/\/social\/([^\/]+)$/);

        if (pathMatch && pathMatch[1]) {
            const slug = pathMatch[1];
            const apiUrl = `https://api.robloxscripts.gg/social/${slug}`;

            fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                if (data && data.target_link) {
                    redirectWithStatus(data.target_link, 'Redirecting...');
                } else {
                    updateStatus('Target link not found', true);
                }
            })
                .catch(err => {
                updateStatus('API error', true);
            });
        }
    }

    // --- ScriptPastebins.com ---
    if (currentUrl.includes('scriptpastebins.com')) {
        updateStatus('Bypassing ScriptPastebins...');
        const runScriptPastebins = () => {
            localStorage.setItem("unlockStep", "5");
            updateStatus('Progress set to 5/5');

            ['button2', 'button3', 'button4', 'button5', 'button6'].forEach(id => {
                let btn = document.getElementById(id);
                if (btn) {
                    btn.style.opacity = "1";
                    btn.style.pointerEvents = "auto";
                    btn.setAttribute('href', 'javascript:void(0)');
                    btn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); return false; };
                }
            });

            const unlockSection = document.getElementById('unlock-section');
            const scriptSection = document.getElementById('script-section');

            if (unlockSection) unlockSection.style.display = 'none';
            if (scriptSection) {
                scriptSection.style.display = 'block';
                const pre = scriptSection.querySelector('pre');
                if (pre) {
                    const scriptCode = pre.innerText;
                    navigator.clipboard.writeText(scriptCode);
                    updateStatus('Script copied to clipboard!');
                } else {
                    updateStatus('Script section found but no pre element');
                }
            } else {
                updateStatus('Script section not found');
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runScriptPastebins);
        } else {
            runScriptPastebins();
        }
    }

    // --- Bstlar.com ---
    if (currentUrl.includes('bstlar.com')) {
        updateStatus('Intercepting Bstlar...');

        const { fetch: originalFetch } = window;
        window.fetch = async (...args) => {
            const url = args[0].toString();

            const response = await originalFetch(...args);

            if (url.includes('/api/link')) {
                updateStatus('Link API intercepted...');
                const clone = response.clone();
                clone.json().then(async (data) => {
                    const urlParams = new URLSearchParams(url.split('?')[1]);
                    const linkActionId = urlParams.get('link_action_id');
                    const linkId = data?.id;

                    if (linkId && linkActionId) {
                        updateStatus('Completing link...');
                        const completeRes = await originalFetch('/api/link-completed', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ link_id: linkId, link_action_id: linkActionId })
                        });
                        const completeData = await completeRes.json();
                        if (completeData?.destination_url) {
                            redirectWithStatus(completeData.destination_url, 'Redirecting...');
                        }
                    }
                }).catch(e => updateStatus('Error parsing response', true));
            }
            return response;
        };

        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            this._url = url;
            this._method = method;
            return originalOpen.call(this, method, url, ...rest);
        };

        XMLHttpRequest.prototype.send = function(body) {
            if (this._url && this._url.includes('/api/link')) {
                this.addEventListener('load', () => {
                    try {
                        const data = JSON.parse(this.responseText);
                        const urlParams = new URLSearchParams(this._url.split('?')[1]);
                        const linkActionId = urlParams.get('link_action_id');
                        const linkId = data?.id;

                        if (linkId && linkActionId) {
                            fetch('/api/link-completed', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ link_id: linkId, link_action_id: linkActionId })
                            }).then(res => res.json()).then(completeData => {
                                if (completeData?.destination_url) {
                                    redirectWithStatus(completeData.destination_url, 'Redirecting...');
                                }
                            });
                        }
                    } catch(e) { updateStatus('XHR Error', true); }
                });
            }
            return originalSend.call(this, body);
        };
    }

    // --- go.linkify.ru ---
    if (currentUrl.includes('go.linkify.ru')) {
        updateStatus('Scanning Linkify...');

        window.offerClicked = true;

        const runLinkify = () => {
            const scripts = document.querySelectorAll('script');
            let targetUrl = null;

            for (const script of scripts) {
                const content = script.textContent || script.innerText;
                if (content && content.includes('.offer-link') && content.includes('go.linkify.ru/get/')) {
                    const match = content.match(/https:\/\/go\.linkify\.ru\/get\/[a-zA-Z0-9]+/);
                    if (match) {
                        targetUrl = match[0];
                        break;
                    }
                }
            }

            if (targetUrl) {
                redirectWithStatus(targetUrl, 'Link found, redirecting...');
            } else {
                updateStatus('Searching for link...');
                setTimeout(() => {
                    const allText = document.documentElement.innerHTML;
                    const match = allText.match(/https:\/\/go\.linkify\.ru\/get\/[a-zA-Z0-9]+/);
                    if (match) {
                        redirectWithStatus(match[0], 'Link found, redirecting...');
                    } else {
                        updateStatus('Link not found', true);
                    }
                }, 2000);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runLinkify);
        } else {
            runLinkify();
        }
    }

    // --- lockr.so ---
    if (currentUrl.includes('lockr.so')) {
        updateStatus('Processing Lockr...');

        const pathParts = window.location.pathname.split('/');
        const lockerCode = pathParts[pathParts.length - 1];

        if (lockerCode && lockerCode.length > 0) {
            const runLockr = async () => {
                try {
                    updateStatus('Getting view data...');
                    const viewRes = await fetch(`https://lockr.so/api/v1/lockers/${lockerCode}/view`);
                    const viewData = await viewRes.json();

                    const token = viewData?.data?.token;

                    if (!token) {
                        updateStatus('Token not found', true);
                        return;
                    }

                    updateStatus('Token acquired, completing task...');

                    await fetch(`https://lockr.so/api/v1/lockers/${lockerCode}/task?token=${token}`);

                    updateStatus('Polling for unlock...');

                    const pollUnlock = async () => {
                        try {
                            const unlockRes = await fetch(`https://lockr.so/api/v1/lockers/${lockerCode}/unlock?token=${token}`);
                            const unlockData = await unlockRes.json();

                            const targetUrl = unlockData?.data?.target;
                            if (targetUrl) {
                                redirectWithStatus(targetUrl, 'Unlocked! Redirecting...');
                            } else {
                                setTimeout(pollUnlock, 2000);
                            }
                        } catch (err) {
                            setTimeout(pollUnlock, 2000);
                        }
                    };

                    pollUnlock();

                } catch (err) {
                    updateStatus('Error in lockr.so', true);
                }
            };

            runLockr();
        } else {
            updateStatus('Invalid locker code', true);
        }
    }
})();
