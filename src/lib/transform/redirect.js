// Add a basic redirect transformation, as an example
Resolvr.addTransform((type, result) => {
    if (type !== "TXT") {
        return result;
    }

    result.data.forEach((data) => {
        if (data.indexOf("redirect=") === 0) {
            result.redirect = data.substring(9);
        }
    });

    return result;
});
