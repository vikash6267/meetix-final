# HeimatTalksSFU API Documentation

This document provides detailed information about the RESTful API endpoints available in HeimatTalksSFU, allowing you to integrate the platform with your own applications.

## Table of Contents

- [Authentication](#authentication)
- [Base URL](#base-url)
- [API Endpoints](#api-endpoints)
  - [Get Statistics](#get-statistics)
  - [Get Meetings](#get-meetings)
  - [Create Meeting](#create-meeting)
  - [Create Direct Join URL](#create-direct-join-url)
  - [Get JWT Token](#get-jwt-token)
- [Data Models](#data-models)
- [Examples](#examples)
  - [JavaScript Examples](#javascript-examples)
  - [PHP Examples](#php-examples)
  - [Python Examples](#python-examples)
  - [Bash Examples](#bash-examples)
- [Embedding Meetings](#embedding-meetings)

## Authentication

All API requests require authentication using an API key secret. The API key is defined in the `app/src/config.js` file:

```js
api: {
    keySecret: 'heimattalksfu_default_secret',
}
```

You should replace this with your own secure key for production use.

To authenticate your requests, include the API key in the request header:

```
Authorization: your_api_key_secret
```

## Base URL

The base URL for all API endpoints is:

```
https://your-heimattalk-server.com/api/v1
```

## API Endpoints

### Get Statistics

Returns the current statistics of the HeimatTalks SFU server, including the total number of rooms and participants.

- **URL**: `/stats`
- **Method**: `GET`
- **Authentication**: Required

**Response Example**:

```json
{
  "success": true,
  "timestamp": "2023-05-15T12:34:56Z",
  "totalRooms": 5,
  "totalPeers": 12
}
```

### Get Meetings

Returns a list of all active meetings/rooms and their participants.

- **URL**: `/meetings`
- **Method**: `GET`
- **Authentication**: Required

**Response Example**:

```json
{
  "meetings": [
    {
      "roomId": "room123",
      "peers": [
        {
          "name": "User1",
          "presenter": true,
          "video": true,
          "audio": true,
          "screen": false,
          "hand": false,
          "os": "Windows 10",
          "browser": "Chrome 90.0.4430.212"
        },
        {
          "name": "User2",
          "presenter": false,
          "video": true,
          "audio": false,
          "screen": false,
          "hand": true,
          "os": "macOS 11.4",
          "browser": "Safari 14.1"
        }
      ]
    }
  ]
}
```

### Create Meeting

Creates a new meeting and returns the meeting URL.

- **URL**: `/meeting`
- **Method**: `POST`
- **Authentication**: Required

**Response Example**:

```json
{
  "meeting": "https://sfu.heimattalk.com/join/abcdef123456"
}
```

### Create Direct Join URL

Creates a URL that allows direct access to a room with specific parameters.

- **URL**: `/join`
- **Method**: `POST`
- **Authentication**: Required

**Request Body Parameters**:

| Parameter     | Type          | Description                                       | Default     |
|---------------|---------------|---------------------------------------------------|-------------|
| room          | string        | Room ID                                           | random UUID |
| roomPassword  | string/boolean| Password for the room                             | false       |
| name          | string        | User's name                                       | random name |
| avatar        | string/boolean| URL to user's avatar image                        | false       |
| audio         | boolean       | Whether to enable audio on join                   | false       |
| video         | boolean       | Whether to enable video on join                   | false       |
| screen        | boolean       | Whether to share screen on join                   | false       |
| hide          | boolean       | Whether to hide the user's video                  | false       |
| notify        | boolean       | Whether to show notification on join              | false       |
| duration      | string        | Meeting duration (format: HH:MM:SS or "unlimited")| "unlimited" |
| token         | object        | JWT token object (for authentication)             | null        |

**Token Object Parameters**:

| Parameter     | Type          | Description                                       | Default     |
|---------------|---------------|---------------------------------------------------|-------------|
| username      | string        | Username for authentication                       | "username"  |
| password      | string        | Password for authentication                       | "password"  |
| presenter     | boolean       | Whether the user is a presenter                   | true        |
| expire        | string        | JWT token expiration time                         | "1h"        |

**Request Example**:

```json
{
  "room": "my-meeting-room",
  "roomPassword": "secure123",
  "name": "John Doe",
  "avatar": "https://example.com/avatar.jpg",
  "audio": true,
  "video": true,
  "screen": false,
  "hide": false,
  "notify": true,
  "duration": "01:00:00",
  "token": {
    "username": "john",
    "password": "doe123",
    "presenter": true,
    "expire": "2h"
  }
}
```

**Response Example**:

```json
{
  "join": "https://sfu.heimattalk.com/join?room=my-meeting-room&roomPassword=secure123&name=John%20Doe&avatar=https%3A%2F%2Fexample.com%2Favatar.jpg&audio=true&video=true&screen=false&hide=false&notify=true&duration=01:00:00&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get JWT Token

Generates a JWT token that can be used for authentication.

- **URL**: `/token`
- **Method**: `POST`
- **Authentication**: Required

**Request Body Parameters**:

| Parameter     | Type          | Description                                       | Default     |
|---------------|---------------|---------------------------------------------------|-------------|
| username      | string        | Username for authentication                       | "username"  |
| password      | string        | Password for authentication                       | "password"  |
| presenter     | boolean       | Whether the user is a presenter                   | true        |
| expire        | string        | JWT token expiration time                         | "1h"        |

**Request Example**:

```json
{
  "username": "john",
  "password": "doe123",
  "presenter": true,
  "expire": "2h"
}
```

**Response Example**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Data Models

### Stats Response

```json
{
  "success": true,
  "timestamp": "2023-05-15T12:34:56Z",
  "totalRooms": 5,
  "totalPeers": 12
}
```

### Meeting Response

```json
{
  "meeting": "https://sfu.heimattalk.com/join/abcdef123456"
}
```

### Join Response

```json
{
  "join": "https://sfu.heimattalk.com/join?room=my-meeting-room&roomPassword=secure123&name=John%20Doe&avatar=https%3A%2F%2Fexample.com%2Favatar.jpg&audio=true&video=true&screen=false&hide=false&notify=true&duration=01:00:00&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Token Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Examples

### JavaScript Examples

```javascript
// meetings.js - Get all meetings
const fetch = require('node-fetch');

const API_KEY = 'heimattalksfu_default_secret';
const MIROTALK_URL = 'https://sfu.heimattalk.com/api/v1/meetings';

function getMeetings() {
    return fetch(MIROTALK_URL, {
        method: 'GET',
        headers: {
            authorization: API_KEY,
            'Content-Type': 'application/json',
        },
    });
}

getMeetings()
    .then((response) => response.json())
    .then((data) => {
        console.log('Meetings:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
```

```javascript
// meeting.js - Create a meeting
const fetch = require('node-fetch');

const API_KEY = 'heimattalksfu_default_secret';
const MIROTALK_URL = 'https://sfu.heimattalk.com/api/v1/meeting';

function createMeeting() {
    return fetch(MIROTALK_URL, {
        method: 'POST',
        headers: {
            authorization: API_KEY,
            'Content-Type': 'application/json',
        },
    });
}

createMeeting()
    .then((response) => response.json())
    .then((data) => {
        console.log('Meeting:', data.meeting);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
```

```javascript
// join.js - Create a direct join URL
const fetch = require('node-fetch');

const API_KEY = 'heimattalksfu_default_secret';
const MIROTALK_URL = 'https://sfu.heimattalk.com/api/v1/join';

function createJoinURL() {
    return fetch(MIROTALK_URL, {
        method: 'POST',
        headers: {
            authorization: API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            room: 'test',
            roomPassword: false,
            name: 'heimattalksfu',
            audio: true,
            video: true,
            screen: false,
            hide: false,
            notify: true,
            token: {
                username: 'username',
                password: 'password',
                presenter: true,
                expire: '1h'
            }
        }),
    });
}

createJoinURL()
    .then((response) => response.json())
    .then((data) => {
        console.log('Join URL:', data.join);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
```

### PHP Examples

```php
<?php
// meetings.php - Get all meetings
$API_KEY = 'heimattalksfu_default_secret';
$MIROTALK_URL = 'https://sfu.heimattalk.com/api/v1/meetings';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $MIROTALK_URL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'authorization: ' . $API_KEY,
    'Content-Type: application/json'
));

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

if ($httpcode == 200) {
    $data = json_decode($response);
    echo "Meetings: " . json_encode($data, JSON_PRETTY_PRINT) . PHP_EOL;
} else {
    echo "Error: " . $response . PHP_EOL;
}
```

```php
<?php
// meeting.php - Create a meeting
$API_KEY = 'heimattalksfu_default_secret';
$MIROTALK_URL = 'https://sfu.heimattalk.com/api/v1/meeting';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $MIROTALK_URL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'authorization: ' . $API_KEY,
    'Content-Type: application/json'
));

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);

if ($httpcode == 200) {
    $data = json_decode($response);
    echo "Meeting: " . $data->meeting . PHP_EOL;
} else {
    echo "Error: " . $response . PHP_EOL;
}
```

### Python Examples

```python
# meetings.py - Get all meetings
import requests
import json

API_KEY = 'heimattalksfu_default_secret'
MIROTALK_URL = 'https://sfu.heimattalk.com/api/v1/meetings'

headers = {
    'authorization': API_KEY,
    'Content-Type': 'application/json'
}

response = requests.get(MIROTALK_URL, headers=headers)

if response.status_code == 200:
    data = response.json()
    print("Meetings:", json.dumps(data, indent=2))
else:
    print("Error:", response.text)
```

```python
# meeting.py - Create a meeting
import requests

API_KEY = 'heimattalksfu_default_secret'
MIROTALK_URL = 'https://sfu.heimattalk.com/api/v1/meeting'

headers = {
    'authorization': API_KEY,
    'Content-Type': 'application/json'
}

response = requests.post(MIROTALK_URL, headers=headers)

if response.status_code == 200:
    data = response.json()
    print("Meeting:", data['meeting'])
else:
    print("Error:", response.text)
```

### Bash Examples

```bash
#!/bin/bash
# meetings.sh - Get all meetings
API_KEY="heimattalksfu_default_secret"
MIROTALK_URL="https://sfu.heimattalk.com/api/v1/meetings"

curl -X GET \
    -H "authorization: $API_KEY" \
    -H "Content-Type: application/json" \
    $MIROTALK_URL
```

```bash
#!/bin/bash
# meeting.sh - Create a meeting
API_KEY="heimattalksfu_default_secret"
MIROTALK_URL="https://sfu.heimattalk.com/api/v1/meeting"

curl -X POST \
    -H "authorization: $API_KEY" \
    -H "Content-Type: application/json" \
    $MIROTALK_URL
```

## Embedding Meetings

You can embed HeimatTalks SFU meetings in your application using an iframe:

```html
<iframe
    allow="camera; microphone; display-capture; fullscreen; clipboard-read; clipboard-write; web-share; autoplay"
    src="https://sfu.heimattalk.com/join/your_room_name"
    style="height: 100vh; width: 100vw; border: 0px;"
></iframe>
```

For a quick integration, you can use the default room creation URL:

```html
<iframe
    allow="camera; microphone; display-capture; fullscreen; clipboard-read; clipboard-write; web-share; autoplay"
    src="https://sfu.heimattalk.com/newroom"
    style="height: 100vh; width: 100vw; border: 0px;"
></iframe>
``` 