<h1 align="center">HeimatVerse SFU</h1>


- Unlimited conference rooms with no time limitations.
- Live broadcasting streaming.
- Translated into 133 languages.
- Support for the OpenID Connect (OIDC) authentication layer.
- Host protection to prevent unauthorized access.
- User auth to prevent unauthorized access.
- JWT.io securely manages credentials for host configurations and user authentication, enhancing security and streamlining processes.
- Room password protection.
- Room lobby, central gathering space.
- Room spam mitigations, focused on preventing spam.
- Geolocation, identification or estimation of the real-world geographic location of the participants.
- Compatible with desktop and mobile devices.
- Optimized mobile room URL sharing.
- Webcam streaming with front and rear camera support for mobile devices.
- Virtual Background and Blur Support: Upload from file, URL, or drag & drop!
- Broadcasting, distribution of audio or video content to a wide audience.
- Crystal-clear audio streaming with speaking detection and volume indicators.
- Screen sharing for presentations.
- File sharing with drag-and-drop support.
- Choose your audio input, output, and video source.
- Supports video quality up to 4K.
- Supports advance Video/Document Picture-in-Picture (PiP) offering a more streamlined and flexible viewing experience.
- Record your screen, audio, and video locally or on your Server.
- Snapshot video frames and save them as PNG images.
- Chat with an Emoji Picker for expressing feelings, private messages, Markdown support, and conversation saving.
- Push-to-talk functionality, similar to a walkie-talkie.
- Advanced collaborative whiteboard for teachers.
- Advanced collaborative powerful rich text editor.
- Real-time sharing of YouTube embed videos, video files (MP4, WebM, OGG), and audio files (MP3).
- Real-time polls, allows users to create and participate in live polls, providing instant feedback and results.
- Meeting Duration (HH:MM:SS): Set the meeting time in hours, minutes, and seconds for precise duration control.
- Integrated RTMP server, fully compatible with **[OBS](https://obsproject.com)**.
- Supports RTMP streaming from files, URLs, webcams, screens, and windows.
- Full-screen mode with one-click video element zooming and pin/unpin.
- Customizable UI themes.
- Right-click options on video elements for additional controls.

</details>


<details>
<summary>Direct Join</summary>

<br/>

- You can `directly join a room` by using link like:
- 

    | Params       | Type           | Description               |
    | ------------ | -------------- | ------------------------- |
    | room         | string         | Room Id                   |
    | roomPassword | string/boolean | Room password             |
    | name         | string         | User name                 |
    | avatar       | string/boolean | User avatar               |
    | audio        | boolean        | Audio stream              |
    | video        | boolean        | Video stream              |
    | screen       | boolean        | Screen stream             |
    | notify       | boolean        | Welcome message           |
    | hide         | boolean        | Hide myself               |
    | duration     | string         | Meeting duration HH:MM:SS |
    | token        | string         | JWT                       |

</details>

<details>
<summary>Host Protection Configuration</summary>

<br/>

When [host.protected] or `host.user_auth` is enabled, the host/users can provide a valid token for direct joining the room as specified in the `app/src/config.js` file.

| Params           | Value                                                                            | Description                                                                            |
| ---------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `host.protected` | `true` if protection is enabled, `false` if not (default false)                  | Requires the host to provide a valid username and password during room initialization. |
| `host.user_auth` | `true` if user authentication is required, `false` if not (default false).       | Determines whether host authentication is required.                                    |
| `host.users`     | JSON array with user objects: `{"username": "username", "password": "password"}` | List of valid host users with their credentials.                                       |

Example:

```js
    host: {
        protected: true,
        user_auth: true,
        users: [
            {
                username: 'username',
                password: 'password',
                displayname: 'displayname',
                allowed_rooms: ['*'],
            },
            {
                username: 'username2',
                password: 'password2',
                displayname: 'displayname2',
                allowed_rooms: ['room1', 'room2'],
            },
            //...
        ],
    },
```

</details>

<details open>

![nodejs](public/images/nodejs.png)

Install `NodeJS 18.X` and `npm` using [Node Version Manager](https://docs.mirotalk.com/nvm/nvm/)

---

- Start the server

```bash
# Clone this repo
$ git clone <PROJECT-URL>
# Go to to dir 
$ cd projectname
# Copy app/src/config.template.js in app/src/config.js and edit it if needed
$ cp app/src/config.template.js app/src/config.js
# Copy .env.template to .env and edit it if needed
$ cp .env.template .env
# Install dependencies - be patient, the first time will take a few minutes, in the meantime have a good coffee ;)
$ npm install
# Start the server
$ npm start
# If you want to start the server on a different port than the default use an env var
$ SERVER_LISTEN_PORT=3011 npm start
```

- Open [http://localhost:3010](http://localhost:3010) or `:3011` if the default port has been changed in your browser.

<br/>


</details>