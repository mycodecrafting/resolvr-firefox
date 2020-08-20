# Resolvr

Firefox browser extension to resolve Handshake domains + DNS TXT metadata records. Metadata records support Skynet, redirects, QR codes, and more.

## Video

  * [Video Overview](https://youtu.be/-ZOPTeFb0jw)

## Current Release

  * [Version 1.0.0](https://addons.mozilla.org/en-US/firefox/addon/resolvr/)

## Handshake TLDs

Resolvr can lookup DNS for Handshake domains and subdomains, and transparently proxy the request to them.

Some example sites running on Handshake domains [can be found on the Awesome Handshake repo](https://github.com/namebasehq/awesome-handshake#handshake-sites).

_Note you will need to running Resolvr or another DNS proxy that supports Handshake domains for these links to work._

## Fun with TXT metadata

In addition to resolving Handshake TLDs, Resolvr supports having some fun with DNS TXT records. It supports these records 
on all TLDs.

### TXT metadata format

The format for all supported TXT metadata records is `type=value`

### TXT metadata types

Type | Description | Example
-----|-------------|--------
redirect | Redirects to another URL | `redirect=https://www.google.com/`
skylink | Sia Skylink (redirect to) | `skylink=EAC5HJr5Pu086EAZG4fP_r6Pnd7Ft366vt6t2AnjkoFb9Q`
qr | Generate QR code | `qr=I am a QR code`
hns | Generate QR with HNS address | `hns=hs1qnnnpqc5w4qjjx26mf97wzl3d9y3ya8hnq89t4f`

### TXT metadata examples

_Note you will need to running Resolvr for these links to work correctly_

URL | TXT Record
----|-----------
[html.skynet.manos__the_hands_of_fate.](https://html.skynet.manos__the_hands_of_fate/) | `skylink=PAL0w4SdA5rFCDGEutgpeQ50Om-YkBabtXVOJAkmedslKw`
[image.skynet.manos__the_hands_of_fate.](https://image.skynet.manos__the_hands_of_fate/) | `skylink=IADUs8d9CQjUO34LmdaaNPK_STuZo24rpKVfYW3wPPM2uQ`
[audio.skynet.manos__the_hands_of_fate.](https://audio.skynet.manos__the_hands_of_fate/) | `skylink=_A2zt5SKoqwnnZU4cBF8uBycSKULXMyeg1c5ZISBr2Q3dA`
[video.skynet.manos__the_hands_of_fate.](https://video.skynet.manos__the_hands_of_fate/) | `skylink=CABAB_1Dt0FJsxqsu_J4TodNCbCGvtFf1Uys_3EgzOlTcg`
[json.skynet.manos__the_hands_of_fate.](https://json.skynet.manos__the_hands_of_fate/) | `skylink=AAC0uO43g64ULpyrW0zO3bjEknSFbAhm8c-RFP21EQlmSQ`
[pdf.skynet.manos__the_hands_of_fate.](https://pdf.skynet.manos__the_hands_of_fate/) | `skylink=XABvi7JtJbQSMAcDwnUnmp2FKDPjg8_tTTFP4BwMSxVdEg`
[dapp.skynet.manos__the_hands_of_fate.](https://dapp.skynet.manos__the_hands_of_fate/) | `skylink=EAC5HJr5Pu086EAZG4fP_r6Pnd7Ft366vt6t2AnjkoFb9Q/index.html`
[deposit.manos__the_hands_of_fate.](https://deposit.manos__the_hands_of_fate/) | `hns=hs1qnnnpqc5w4qjjx26mf97wzl3d9y3ya8hnq89t4f`

## FAQ

**Q: Why Firefox? Will there be a Chrome build?**

Firefox was chosen to be the initial implementation because the required browser extension APIs in Firefox are ahead of 
what Chrome is capable of. Primarily, Firefox's `webRequest.onBeforeRequest` supports Promises, and Chrome does not. In 
addition, Firefox has a `proxy.onRequest` API, which also supports Promises, making it an ideal candidate. Chrome's proxy 
API is not as robust.

In order to bring Resolvr to Chrome, I would have to use a synchronous XMLHttpRequest -- which is a deprecated feature. Or 
I would have to employ some hackish workarounds that are a less than ideal user experience. Or Chrome would have to update 
their `webRequest.onBeforeRequest` to support Promises.

At this point in time, since I do not desire to depend upon deprecated features, and do not wish to deliver a subpar user 
experience, I have no official plans to build a Chrome extension.

**Q: What Skynet portal do you use for TXT records with skylinks?**

Resolvr attempts to determine which Skynet portal is the most optimal to use for your location and connection. It rechecks 
and adjusts this once per hour.


