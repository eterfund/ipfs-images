# Attachments

Attachments server.

## Classes

<dl>
<dt><a href="#AuthError">AuthError</a> ⇐ <code>Error</code></dt>
<dd><p>Class represents custom Auth error.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#upload">upload(request, response)</a> ⇒ <code>Promise</code></dt>
<dd><p>Route handler for /ul.</p>
</dd>
<dt><a href="#download">download(request, response)</a> ⇒ <code>Promise</code></dt>
<dd><p>Route handler for /dl/:hash/:filename.</p>
</dd>
<dt><a href="#downloadThumb">downloadThumb(request, response)</a> ⇒ <code>Promise</code></dt>
<dd><p>Route handler for /dl/thumb/:size/:hash.</p>
</dd>
<dt><a href="#delAttachment">delAttachment(request, response)</a> ⇒ <code>Promise</code></dt>
<dd><p>Route handler for /del/:hash/</p>
</dd>
<dt><a href="#routes">routes(app)</a></dt>
<dd><p>Configures HTTP routes.</p>
</dd>
<dt><a href="#auth">auth(ips, ip)</a> ⇒ <code>Promise</code></dt>
<dd><p>Authentication function tests request IP agains a set of allowed IPs.</p>
</dd>
</dl>

<a name="AuthError"></a>

## AuthError ⇐ <code>Error</code>
Class represents custom Auth error.

**Kind**: global class  
**Extends**: <code>Error</code>  
<a name="new_AuthError_new"></a>

### new AuthError(message)
Create an instance of error.


| Param | Type | Description |
| --- | --- | --- |
| message | <code>String</code> | Error message. |

<a name="upload"></a>

## upload(request, response) ⇒ <code>Promise</code>
Route handler for /ul.

**Kind**: global function  
**Returns**: <code>Promise</code> - Fulfills if response was successfully sent,
                            rejects if not.  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Request</code> | HTTP request. |
| response | <code>Response</code> | HTTP response. |

<a name="download"></a>

## download(request, response) ⇒ <code>Promise</code>
Route handler for /dl/:hash/:filename.

**Kind**: global function  
**Returns**: <code>Promise</code> - Fulfills if response was successfully sent,
                            rejects if not.  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Request</code> | HTTP request. |
| response | <code>Response</code> | HTTP response. |

<a name="downloadThumb"></a>

## downloadThumb(request, response) ⇒ <code>Promise</code>
Route handler for /dl/thumb/:size/:hash.

**Kind**: global function  
**Returns**: <code>Promise</code> - Fulfills if response was successfully sent,
                            rejects if not.  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Request</code> | HTTP request. |
| response | <code>Response</code> | HTTP response. |

<a name="delAttachment"></a>

## delAttachment(request, response) ⇒ <code>Promise</code>
Route handler for /del/:hash/

**Kind**: global function  
**Returns**: <code>Promise</code> - Fulfills if response was successfully sent,
                            rejects if not.  

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Request</code> | HTTP request. |
| response | <code>Response</code> | HTTP response. |

<a name="routes"></a>

## routes(app)
Configures HTTP routes.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>Express</code> | Express app. |

<a name="auth"></a>

## auth(ips, ip) ⇒ <code>Promise</code>
Authentication function tests request IP agains a set of allowed IPs.

**Kind**: global function  
**Returns**: <code>Promise</code> - Promise resolves with True if authentication was
                       successful or rejects with AuthError otherwise.  

| Param | Type | Description |
| --- | --- | --- |
| ips | <code>Array.&lt;String&gt;</code> | Array of regexps of allowed IPs. |
| ip | <code>String</code> | Request IP. |

