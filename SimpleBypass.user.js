// ==UserScript==
// @name         Simple bypass
// @namespace    by z3r0d4 and AI
// @version      0.0.5
// @description  Simple AI made bypass
// @author       Zero
// @match        https://linkvertise.com/*
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
// @match        https://sub4unlock.com/*
// @match        https://sub4unlock.me/*
// @match        https://sub4unlock.io/*
// @match        https://sub4unlock.pro/*
// @match        https://sub2unlock.com/*
// @match        https://sub2unlock.me/*
// @match        https://sub2unlock.io/*
// @match        https://sub2unlock.online/*
// @match        https://sub2unlock.top/*
// @match        https://rbscripts.net/*
// @match        https://auth.platorelay.com/*
// @match        https://bstshrt.com/*
// @match        https://link4sub.com/*
// @match        https://*.tapvietcode.com/*
// @grant        none
// @downloadURL  https://github.com/OxyCoder32/all-bypass/raw/refs/heads/main/SimpleBypass.user.js
// @updateURL    https://github.com/OxyCoder32/all-bypass/raw/refs/heads/main/SimpleBypass.user.js
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


    // --- Linkvertise ---
    if (currentUrl.includes('linkvertise.com')) {
        updateStatus('Processing Linkvertise link...');

        let targetUrl = window.location.href;

        if (targetUrl.includes('/dynamic')) {
            const urlObj = new URL(targetUrl);
            const redirectParam = urlObj.searchParams.get('r');

            if (redirectParam) {
                try {
                    const urlDecoded = decodeURIComponent(redirectParam);
                    let base64Part = urlDecoded;
                    const decodedUrl = atob(base64Part);
                    let finalUrl = decodedUrl;
                    try {
                        const jsonData = JSON.parse(decodedUrl);
                        finalUrl = jsonData.link || jsonData.url || jsonData.target;
                    } catch(e) {}
                    if (finalUrl && finalUrl !== targetUrl) {
                        updateStatus('Redirecting...');
                        window.location.href = finalUrl;
                        return;
                    }
                } catch(e) {
                    updateStatus('Decode failed', true);
                }
            }
        }

        updateStatus('Sending to bypass backend...');

        fetch('https://skipped.lol/api/evade/lv', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                URL: targetUrl,
                userAndHash: ''
            })
        })
            .then(response => response.json())
            .then(data => {
            if (data && data.type === 'url' && data.resp) {
                updateStatus('Link bypassed! Redirecting...');
                setTimeout(() => {
                    window.location.href = data.resp;
                }, 500);
            } else if (data && data.type === 'paste' && data.resp) {
                updateStatus('Copying to clipboard...');
                navigator.clipboard.writeText(data.resp);
                updateStatus('Copied! You can now close this page.');
            } else {
                updateStatus('Backend response invalid', true);
            }
        })
            .catch(err => {
            updateStatus('Backend request failed: ' + err.message, true);
            console.error(err);
        });
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
        updateStatus('Bypassing Bstlar...');

        // Intercept fetch API
        const { fetch: originalFetch } = window;
        window.fetch = async (...args) => {
            const url = args[0].toString();
            const response = await originalFetch(...args);

            if (url.includes('/api/link')) {
                updateStatus('🎯 API intercepted...');
                const clone = response.clone();
                clone.json().then(async (data) => {
                    const urlParams = new URLSearchParams(url.split('?')[1]);
                    const linkActionId = urlParams.get('link_action_id');
                    const linkId = data?.id;

                    if (linkId && linkActionId) {
                        updateStatus('✅ Completing...');
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
                }).catch(() => updateStatus('❌ Error', true));
            }
            return response;
        };

        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            this._url = url;
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
                    } catch(e) {}
                });
            }
            return originalSend.call(this, body);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                document.body.appendChild(statusPanel);
            });
        } else {
            document.body.appendChild(statusPanel);
        }
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

    // --- Sub4Unlock ---
    if (location.href.includes('sub4unlock.com') || location.href.includes('sub4unlock.me') || location.href.includes('sub4unlock.io') || location.href.includes('sub4unlock.pro')) {
        const panel = document.getElementById('bypass-status-panel');
        const setMsg = (msg) => {
            if (panel) {
                const detail = panel.querySelector('#bypass-status-detail');
                if (detail) detail.textContent = msg;
            }
            console.log(msg);
        };

        setTimeout(() => {
            if (typeof fun9 === 'function') {
                updateStatus('✅ Executing fun9()', true);
                fun9();
            } else {

                const scripts = document.querySelectorAll('script');
                for (const script of scripts) {
                    const content = script.textContent || script.innerText;
                    if (content && content.includes('window.open')) {
                        const match = content.match(/window\.open\s*\(\s*['"]([^'"]+)['"]/);
                        if (match && match[1]) {
                            const url = match[1];
                            updateStatus('✅ redirecting..', true);
                            setTimeout(() => {
                                window.location.href = url;
                            }, 500);
                            break;
                        }
                    }
                }
            }
        }, 3000);
    }

    // --- Sub2Unlock ---
    if (location.href.includes('sub2unlock.com') || location.href.includes('sub2unlock.me') || location.href.includes('sub2unlock.io') || location.href.includes('sub2unlock.top') || location.href.includes('sub2unlock.pro')) {
        const wait = setInterval(() => {
            const btn = document.querySelector('.btn-primary[disabled], #file[disabled]');
            if (btn) {
                clearInterval(wait);
                btn.removeAttribute('disabled');
                btn.disabled = false;
                updateStatus('✅ redirecting..', true);
                btn.click();
            }
        }, 500);
    }

    // --- RBScripts.net ---
    if (currentUrl.includes('rbscripts.net')) {
        updateStatus('Processing RBScripts...');

        let isResolved = false;
        const FAIL_TIMEOUT = 10000;
        let failTimer;

        const setFailTimer = () => {
            failTimer = setTimeout(() => {
                if (!isResolved) {
                    updateStatus('Bypass Failed (Timeout)', true);
                    isResolved = true;
                }
            }, FAIL_TIMEOUT);
        };

        const redirectToDestination = (url, source) => {
            if (!isResolved) {
                isResolved = true;
                clearTimeout(failTimer);
                setTimeout(() => {
                    window.location.href = url;
                }, 500);
            }
        };

        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const url = args[0].toString();

            if (url.includes('/api/custom-redirects/') && !isResolved) {
                updateStatus('Intercepted...');
                try {
                    const response = await originalFetch(...args);
                    const clonedResponse = response.clone();
                    const data = await clonedResponse.json();

                    if (data && data.destination) {
                        redirectToDestination(data.destination, 'API Checkpoint');
                    }
                    return response;
                } catch (e) {
                    return originalFetch(...args);
                }
            }
            return originalFetch(...args);
        };

        const checkForNextData = () => {
            if (isResolved) return;

            const nextDataScript = document.getElementById('__NEXT_DATA__');
            if (nextDataScript) {
                try {
                    const jsonData = JSON.parse(nextDataScript.textContent);
                    const targetUrl = jsonData?.props?.pageProps?.initialTask?.targetUrl;

                    if (targetUrl) {
                        redirectToDestination(targetUrl, '__NEXT_DATA__');
                    }
                } catch (e) {
                    console.error('Error__NEXT_DATA__:', e);
                }
            }
        };

        setFailTimer();

        const observer = new MutationObserver((mutations) => {
            if (isResolved) {
                observer.disconnect();
                return;
            }

            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.id === '__NEXT_DATA__' && node.tagName === 'SCRIPT') {
                                checkForNextData();
                                return;
                            }
                            const innerScript = node.querySelector?.('#__NEXT_DATA__');
                            if (innerScript) {
                                checkForNextData();
                                return;
                            }
                        }
                    }
                }
            }
        });

        const startObservation = () => {
            checkForNextData();

            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startObservation);
        } else {
            startObservation();
        }
    }

    // --- PlatoBoost ---
    if (currentUrl.includes('auth.platorelay.com') || currentUrl.includes('platoboost.com')) {

        const getTicket = () => {
            const params = new URLSearchParams(window.location.search);
            return params.get('d') || params.get('ticket') || window.location.pathname.substring(1);
        };

        const ticket = getTicket();
        if (!ticket || ticket.length < 32) {
            updateStatus('Ticket invalid', true);
        } else {

            async function encryptAesCtr(plaintext, keyBytes, ivBytes) {
                const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-CTR' }, false, ['encrypt']);
                const ciphertext = await crypto.subtle.encrypt(
                    { name: 'AES-CTR', counter: ivBytes, length: 64 },
                    key,
                    new TextEncoder().encode(plaintext)
                );
                return Array.from(new Uint8Array(ciphertext)).map(b => b.toString(16).padStart(2, '0')).join('');
            }

            function stringToCharCodes(str) { return new Uint8Array(str.split('').map(c => c.charCodeAt(0))); }

            function getBrowserFingerprint() {
                return {
                    browserInfo: [
                        { name: 'screen', data: { width: screen.width, height: screen.height, availWidth: screen.availWidth, availHeight: screen.availHeight, colorDepth: screen.colorDepth, pixelDepth: screen.pixelDepth, orientation: { type: screen.orientation?.type || 'landscape-primary', angle: screen.orientation?.angle || 0 } } },
                        { name: 'navigator', data: { userAgent: navigator.userAgent, platform: navigator.platform || 'Win32', maxTouchPoints: navigator.maxTouchPoints || 0, plugins: { length: navigator.plugins.length, item: Array.from(navigator.plugins).map(p => ({ name: p.name, filename: p.filename, description: p.description })) }, mimeTypes: { length: navigator.mimeTypes.length, item: Array.from(navigator.mimeTypes).map(m => ({ type: m.type, description: m.description, suffixes: m.suffixes })) } } },
                        { name: 'performance', data: Date.now() },
                        { name: 'history', data: { length: window.history.length } },
                        { name: 'webdriver', webdriver: navigator.webdriver || false },
                        { name: 'connection', data: { effectiveType: navigator.connection?.effectiveType || '4g', downlink: navigator.connection?.downlink || 10, rtt: navigator.connection?.rtt || 50, saveData: navigator.connection?.saveData || false } }
                    ]
                };
            }

            function generateMouseStream() {
                const events = [];
                const now = Date.now();
                for (let i = 0; i < 30; i++) {
                    events.push({ event: 0, data: { x: Math.random() * screen.width, y: Math.random() * screen.height, target: 'BODY', time: now - (5000 - i * 100) } });
                }
                events.push({ event: 1, data: { x: screen.width/2, y: screen.height/2, target: 'BUTTON', time: now } });
                events.push({ event: 5, data: { time: now, length: events.length } });
                return JSON.stringify({ events });
            }

            (async () => {
                try {
                    const metaRes = await fetch(`/api/session/metadata?ticket=${encodeURIComponent(ticket)}`);
                    const metaData = await metaRes.json();
                    const data = metaData.data;

                    if (data?.key && data.key !== 'KEY_NOT_FOUND') {
                        const textarea = document.querySelector('textarea');
                        if (!textarea) {
                            updateStatus(`✅ KEY: ${data.key}`);
                            navigator.clipboard?.writeText(data.key);
                            if (data.url && data.url !== 'about:blank') redirectWithStatus(data.url, 'Redirecting...');
                            else window.location.reload();
                        }
                        return;
                    }

                    let service = 1;
                    if (data?.activeRevenueProfile) {
                        if (data.activeRevenueProfile.mode === 0) service = data.activeRevenueProfile.service;
                        else if (data.activeRevenueProfile.service & 1) service = 1;
                        else if (data.activeRevenueProfile.service & 2) service = 2;
                        else if (data.activeRevenueProfile.service & 4) service = 4;
                    }

                    const keyBytes = stringToCharCodes(ticket.substring(0, 16));
                    const ivBytes = stringToCharCodes(ticket.substring(16, 32));
                    const meta = await encryptAesCtr(JSON.stringify(getBrowserFingerprint()), keyBytes, ivBytes);
                    const stream = await encryptAesCtr(generateMouseStream(), keyBytes, ivBytes);

                    let resolved = false;
                    try { const lvRes = await fetch('https://linkvertise.com/favicon.ico'); resolved = lvRes.status === 200; } catch(e) {}

                    const stepRes = await fetch(`/api/session/step?ticket=${encodeURIComponent(ticket)}&service=${service}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ captcha: null, meta, stream, resolved })
                    });
                    const stepData = await stepRes.json();

                    if (stepData?.data?.url && stepData.data.url !== 'about:blank') {
                        redirectWithStatus(stepData.data.url, 'Auto Redirecting...');
                        return;
                    }

                    updateStatus('Waiting for key...');
                    for (let i = 0; i < 15; i++) {
                        await new Promise(r => setTimeout(r, 1500));
                        const statusRes = await fetch(`/api/session/status?ticket=${encodeURIComponent(ticket)}`);
                        const statusData = await statusRes.json();
                        if (statusData?.data?.key && statusData.data.key !== 'KEY_NOT_FOUND') {
                            const textarea = document.querySelector('textarea');
                            if (!textarea) {
                                updateStatus(`✅ KEY: ${statusData.data.key}`);
                                navigator.clipboard?.writeText(statusData.data.key);
                                if (statusData.data.url && statusData.data.url !== 'about:blank') redirectWithStatus(statusData.data.url, 'Found');
                                else if (statusData.data.destination && statusData.data.destination !== 'about:blank') redirectWithStatus(statusData.data.destination, 'Found');
                                else window.location.reload();
                            }
                            return;
                        }
                    }
                } catch(err) {
                    updateStatus(`Error: ${err.message}`, true);
                }
            })();
        }
    }

    // --- Bstshrt ---
    if (currentUrl.includes('bstshrt.com')) {
        const initBstShrt = () => {
            updateStatus('Scanning BstShrt...');

            setTimeout(() => {
                const scriptsContent = [...document.scripts].map(s => s.innerHTML).join('');
                const match = scriptsContent.match(/finalUrl[^:]*:[^"]*"([^"\\]+)/);

                if (match && match[1]) {
                    redirectWithStatus(match[1], 'Final URL found!');
                } else {
                    updateStatus('Final URL not found', true);
                }
            }, 2000);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initBstShrt);
        } else {
            initBstShrt();
        }
    }

    // --- Link4Sub ---
    if (currentUrl.includes('link4sub.com')) {

        const hideOverlay = () => {
            const overlay = document.getElementById('qkha-task-locker-overlay');
            if (overlay) {
                overlay.style.display = 'none';
                updateStatus('Overlay hidden!');
                return true;
            }
            return false;
        };

        if (!hideOverlay()) {
            let attempts = 0;
            const maxAttempts = 10;
            const interval = setInterval(() => {
                if (hideOverlay() || ++attempts >= maxAttempts) {
                    clearInterval(interval);
                    if (attempts >= maxAttempts) updateStatus('Overlay not found', true);
                }
            }, 500);
        }
    }

    if (currentUrl.includes('blog.tapvietcode.com')) {
        updateStatus('Looking for continue button...');

        const findAndClickContinue = () => {
            const continueBtn = document.getElementById('continueBtn');
            if (continueBtn && continueBtn.href) {
                const targetUrl = continueBtn.href;
                if (targetUrl && !targetUrl.includes('blog.tapvietcode.com')) {
                    redirectWithStatus(targetUrl, 'Continue button found, redirecting...');
                    return true;
                }
            }
            return false;
        };

        if (!findAndClickContinue()) {
            const observer = new MutationObserver((mutations, obs) => {
                if (findAndClickContinue()) obs.disconnect();
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
            setTimeout(() => {
                observer.disconnect();
                if (!findAndClickContinue()) updateStatus('Continue button not found', true);
            }, 10000);
        }
    }

    if (currentUrl.includes('pro.tapvietcode.com')) {
        updateStatus('Reading _STU from localStorage...');

        let attempts = 0;
        const maxAttempts = 5;

        const findFirstValidUrl = (obj, excludeBase = true) => {
            if (!obj || typeof obj !== 'object') return null;
            const stack = [obj];
            const visited = new Set();
            while (stack.length) {
                const current = stack.pop();
                if (visited.has(current)) continue;
                visited.add(current);
                for (const value of Object.values(current)) {
                    if (typeof value === 'string' && value.startsWith('http')) {
                        if (excludeBase && (value.includes('pro.tapvietcode.com') || value.includes('link4sub.com'))) continue;
                        return value;
                    } else if (value && typeof value === 'object') {
                        stack.push(value);
                    }
                }
            }
            return null;
        };

        const processSTU = () => {
            attempts++;
            updateStatus(`Attempt ${attempts}/${maxAttempts} - Reading _STU...`);
            try {
                const stuRaw = localStorage.getItem('_STU');
                if (!stuRaw) {
                    if (attempts >= maxAttempts) {
                        updateStatus('_STU not found after max attempts', true);
                        return true;
                    }
                    return false;
                }

                const stuData = JSON.parse(stuRaw);
                let targetUrl = stuData?.data?.lnk?.lnk1?.url;
                if (!targetUrl || targetUrl === '#') targetUrl = findFirstValidUrl(stuData);

                if (targetUrl && targetUrl !== '#') {
                    redirectWithStatus(targetUrl, 'Destination found, redirecting...');
                    return true;
                }

                if (attempts >= maxAttempts) {
                    updateStatus('No valid URL found after max attempts', true);
                    return true;
                }
                return false;
            } catch (e) {
                if (attempts >= maxAttempts) {
                    updateStatus(`Error after max attempts: ${e.message}`, true);
                    return true;
                }
                updateStatus(`Error (attempt ${attempts}): ${e.message}`, true);
                return false;
            }
        };

        const interval = setInterval(() => {
            const shouldStop = processSTU();
            if (shouldStop) clearInterval(interval);
        }, 2000);

        setTimeout(() => {
            const shouldStop = processSTU();
            if (shouldStop) clearInterval(interval);
        }, 500);
    }


})();
