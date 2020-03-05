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

### Docs

(Currently) **all** API requests require an authentication token to be included in the headers: `Authentication: Bearer ${token}`.

All responses take the form of `{success: boolean, result: any, error: string | null}`.

This package exports types, you can import them with `import {APIResult, Link, ...} from '@linkhere/backend'`.

#### `/api/v1/links`

**GET**

Query parameters:

- `limit`: number of links to return, default: `10`
- `skip`: number of links to skip when querying, default: `0`
- `hidden`: whether or not to return links marked as hidden, default: `false`

Returns: `{links: Link[], hasMore: boolean}`.

**POST**

Body parameter: `{urls: string[]}`.

Returns: `{links: Link[]}`.

Note: may return before screenshots have been captured.

**PUT**

Path parameters:

- `/:id`: `id` of link to update

Body parameter: `Link`.

Returns: `Link`.

#### `/api/v1/screenshots`

**GET**

Path parameters:

- `/:id`: `id` of link

Returns: `Return.DownloadBinaryData`.
