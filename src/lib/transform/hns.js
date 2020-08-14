// HNS address to QR code
Resolvr.addTransform((type, result) => {
    if (type !== "TXT") {
        return result;
    }

    result.data.forEach((data) => {
        if (data.indexOf("hns=") === 0) {
            result.data.push("qr=" + data.substring(4));
        }
    });

    return result;
});
