class Resolvr {

    constructor() {
        this.cache = new Store("resolv-cache", {});
        this.transforms = [];
    }

    typeConst(type) {
        if (type === "A") return 1;
        if (type === "TXT") return 16;
        return 0;
    }

    isExpired(dnsResult) {
        return dnsResult.expires < Date.now();
    }

    async lookup(hostname, type="A", dohUrl="https://dns.resolvr.info/dns-query") {
        const now = Date.now();
        let dnsResult = { data: [], expires: now + (60 * 1000) };

        let lookup = new URL(dohUrl);
        lookup.searchParams.set("name", hostname);
        lookup.searchParams.set("type", type);

        let r = await fetch(lookup.href);
        if (r.status === 200) {
            const response = await r.json();
            if (response.hasOwnProperty("Answer") === true) {
                let data = [];
                let lowestTTL = false;

                response.Answer.forEach(function(answer) {
                    if (answer.type === this.typeConst(type)) {
                        let d = answer.data;

                        if (d.indexOf('"') === 0) {
                            d = d.substring(1, d.length - 1);
                        }

                        data.push(d)

                        if (lowestTTL === false || answer.TTL < lowestTTL) {
                            lowestTTL = answer.TTL;
                        }
                    }
                }.bind(this));

                dnsResult.data = data;
                dnsResult.expires = now + (lowestTTL * 1000);

            // Set TTL from authority record
            } else if (response.hasOwnProperty("Authority") === true) {
                dnsResult.expires = now + (response.Authority[0].TTL * 1000);
            }
        }

        // lokup failed on default dohUrl
        if (dohUrl === "https://dns.resolvr.info/dns-query" && dnsResult.data.length === 0) {
            const tld = hostname.split(".").pop();
            // Lookup HNS TXT records in DNS authoritative server
            if (type === "TXT" && !IANA_TLDS.includes(tld)) {
                dnsResult = await this.lookup(hostname, type, "https://dns.resolvr.info/dns-auth-query");
            }
        }

        return dnsResult;
    }

    async resolv(hostname, type="A") {
        // Resolv from cache
        const cacheKey = hostname + ":" + type;
        let dnsResult = this.cache.get(cacheKey);

        // not in cache or expired
        if (!dnsResult || this.isExpired(dnsResult)) {
            dnsResult = await this.lookup(hostname, type);
            this.cache.set(cacheKey, dnsResult);
        }

        dnsResult.redirect = false;

        this.transforms.forEach(function(transform) {
            dnsResult = transform(type, dnsResult);
        });

        return dnsResult;
    }

    static instance() {
        if (Resolvr._instance === null) {
            Resolvr._instance = new this();
        }
        return Resolvr._instance;
    }

    static addTransform(transform) {
        this.instance().transforms.push(transform);
    }

}

Resolvr._instance = null;
