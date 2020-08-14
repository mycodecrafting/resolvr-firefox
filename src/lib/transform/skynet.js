const SkynetPortals = [
    "siasky.net",
    "skyportal.xyz",
    "skydrain.net",
    "sialoop.net",
    "skynet.luxor.tech",
    "skynet.tutemwesi.com",
    "www.siacdn.com",
    "vault.lightspeedhosting.com",
    "us-east.siasky.net",
    "us-west.siasky.net",
    "germany.siasky.net",
    "helsinki.siasky.net"
];

const SKYNET_BENCHMARK_FILE = "_A2zt5SKoqwnnZU4cBF8uBycSKULXMyeg1c5ZISBr2Q3dA";

let SkynetSettings = new Store("skynet-settings", { "portal": SkynetPortals[0] });

async function timePortals() {
    if (Settings.get("enabled") === false) {
        return;
    }

    console.log("Calculating fastest skynet portal. This may take several minutes.");

    let promises = [];
    SkynetPortals.forEach(portal => {
        let start = Date.now();
        let url = "https://" + portal + "/" + SKYNET_BENCHMARK_FILE + "?cachebust=" + String(start);
        promises.push(fetch(url).then(response => [portal, response.status, start, Date.now()]));
    });

    let data = await Promise.all(promises);

    let fastestPortal = SkynetSettings.get("portal");
    let fastestTime = false;
    data.forEach(result => {
        if (result[1] === 200) {
            let time = result[3] - result[2];
            if (time < fastestTime || fastestTime === false) {
                fastestTime = time;
                fastestPortal = result[0];
            }
        }
    });

    console.log("Fastest skynet portal = " + fastestPortal);

    // save in SkynetSettings
    SkynetSettings.set("portal", fastestPortal);
}

Resolvr.addTransform((type, result) => {
    if (type !== "TXT") {
        return result;
    }

    result.data.forEach((data) => {
        if (data.indexOf("skylink=") === 0) {
            result.data.push("redirect=https://" + SkynetSettings.get("portal") + "/" + data.substring(8));
        }

        // fuzzy match skylink (IMO this is poor; a skylink= TXT records is more precise)
        else if (Boolean(data.match(/^[a-zA-Z0-9_-]{46}/)) === true) {
            result.data.push("redirect=https://" + SkynetSettings.get("portal") + "/" + data);
        }
    });

    return result;
});

// attempt to calc the fastest portal
timePortals();

// re-calc the fastest portal once an hour
browser.alarms.create("skynet-time-portals", { periodInMinutes: 60 });
browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "skynet-time-portals") {
        timePortals();
    }
});
