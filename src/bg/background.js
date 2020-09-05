const updateIcon = () => {
    if (Settings.get("enabled") === true) {
        browser.browserAction.setIcon({path: 'icons/icon19.png'});
        browser.browserAction.setTitle({title: "Resolvr"});
    } else {
        browser.browserAction.setIcon({path: 'icons/icon19-off.png'});
        browser.browserAction.setTitle({title: "Resolvr (Disabled)"});
    }
};

const updateEnabled = () => {
    Settings.set("enabled", Settings.get("enabled") ? false : true);
    updateIcon();
};

const requestHandler = async (request) => {
    if (Settings.get("enabled") === false) {
        return;
    }

    if (request.method != "GET") {
        return;
    }

    const url = new URL(request.url);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
        return;
    }

    // prevent recursion
    if (url.hostname === "dns.resolvr.info") {
        return;
    }

    const queryResult = await Resolvr.instance().resolv(url.hostname, "TXT");

    if (queryResult.redirect === false) {
        return;
    }

    return {
        redirectUrl: queryResult.redirect
    };
};

const handleProxyRequest = async (request) => {
    const direct = { type: "direct" };

    if (Settings.get("enabled") === false) {
        return direct;
    }

    const url = new URL(request.url);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
        return direct;
    }

    // don't even bother checking common TLDs
    const tld = url.hostname.split(".").pop();
    if (IANA_TLDS.includes(tld)) {
        return direct;
    }

    try {
        const dns = await browser.dns.resolve(url.hostname);
        if (dns.addresses[0] === "92.242.140.21") { // Verizon scummy autosearch
            throw new Error("NS_ERROR_UNKNOWN_HOST");
        }
    } catch (e) {
        if (e.message === "NS_ERROR_UNKNOWN_HOST") {
            const queryResult = await Resolvr.instance().resolv(url.hostname, "A");
            if (queryResult.data.length > 0) {
                if (url.protocol === "https:") {
                    return { type: "https", host: queryResult.data[0], port: url.port || 443 };
                } else {
                    return { type: "http", host: queryResult.data[0], port: url.port || 80 };
                }
            }
        }
    }

    return direct;
};

browser.runtime.onInstalled.addListener(() => { Settings.set("enabled", true) });

browser.browserAction.onClicked.addListener(updateEnabled);

browser.webRequest.onBeforeRequest.addListener(requestHandler, { urls : ["<all_urls>"] }, ["blocking"]);

browser.proxy.onRequest.addListener(handleProxyRequest, { urls: ["<all_urls>"] });

updateIcon();
