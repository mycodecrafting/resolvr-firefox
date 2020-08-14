# Resolvr

Firefox browser extension to resolve Handshake domains + DNS TXT metadata records. Metadata records support Skynet, redirects, QR codes, and more.

## Current Release

  * [Version 1.0.0](https://addons.mozilla.org/en-US/firefox/addon/resolvr/)

## Handshake TLDs

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

**Q:**
