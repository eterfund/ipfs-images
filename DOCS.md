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
<dt><a href="#routes">routes(app)</a></dt>
<dd><p>Configures HTTP routes.</p>
</dd>
</dl>

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

<a name="routes"></a>

## routes(app)
Configures HTTP routes.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| app | <code>Express</code> | Express app. |

