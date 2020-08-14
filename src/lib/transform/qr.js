// http://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=this+is+a+test&qzone=1&margin=0&size=400x400&ecc=H
Resolvr.addTransform((type, result) => {
    if (type !== "TXT") {
        return result;
    }

    result.data.forEach((data) => {
        if (data.indexOf("qr=") === 0) {
            let qr = new URL("https://api.qrserver.com/v1/create-qr-code");
            qr.searchParams.set("color", "000000");
            qr.searchParams.set("bgcolor", "FFFFFF");
            qr.searchParams.set("qzone", "1");
            qr.searchParams.set("margin", "0");
            qr.searchParams.set("size", "400");
            qr.searchParams.set("ecc", "H");
            qr.searchParams.set("data", data.substring(3));

            result.data.push("redirect=" + qr.href);
        }
    });

    return result;
});