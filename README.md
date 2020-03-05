## 🚪 backend for linkhere

You probably were referred here from the [linkhere extension README](https://github.com/link-here/extension).  If not, check that out first to understand what this is about.

There's a few optional environment variables:

- `PORT`: the HTTP port to bind to (default: `3000`)
- `DATA_DIR`: the directory to store the database and screenshots (should be an absolute path, default: `./data`)
- `DISABLE_CHROMIUM_SANDBOX`: if set to `true`, runs Chromium without sandboxing (not recommended, default: `false`)

**Note**: I strongly recommend using a reverse proxy with HTTPS.

### Running in Docker (recommended)

A minimal example:

```bash
docker run -v "$(pwd)/linkhere":/data -p 3000:3000 codetheweb/linkhere
```

This will expose the API on port 3000 and create a folder called `linkhere` in your current directory that stores the database & screenshots.

Or, for Docker Compose:

```yaml
version: '3.4'

services:
  linkhere:
    image: codetheweb/linkhere
    restart: always
    volumes:
      - ./linkhere:/data
    ports:
      - 3000:3000
```

### Running without Docker

1. Clone this repo with `git clone https://github.com/link-here/backend.git`.
2. Inside the repo, run `yarn install`.
3. Build with `yarn run build`.
4. Start the application with `yarn run start`.

### Next steps

On the first run, an authentication token will be generated and logged to the console.  Copy and paste it into the token field when setting up the extension.
