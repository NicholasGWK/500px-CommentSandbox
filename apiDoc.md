# /api/key

## POST
 Emails an API key to the provided e-mail and stores it.
 If the same e-mail is entered again, API key will be refreshed.

 Currently cannot change username after the first registration :).

### Parameters
#### Query
- email (required)
- username (required)

# /api/photos/:photoId/comments

## GET
Gets all comments for a particular photoID that have been posted to the sandbox.

### Parameters
#### Query
- apiKey: A valid API key (required)

#### URL
- photoId: Any string. Does not have to actually exist on 500px. (required);

## POST
Adds a comment for a particular photoID to the sandbox. Returns a JSON object with the new post's unique key.

### Parameters
#### Query
- apiKey: A valid API key (required)

#### URL
- photoId: Any string. Does not have to actually exist on 500px. (required);

### Body

Body must be a JSON object with the 'text' field.
` {
  text: 'This is a post'
  }`


# /api/photos

## GET
Proxies request to the `/photos` endpoint on 500px. Refer to their documentation.


# /api/photos/:photoId

## GET
Proxies request to the `/photos/:photoId` endpoint on 500px. Refer to their documentation.
