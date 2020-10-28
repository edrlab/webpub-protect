const chalk = require('chalk');
const debug_ = require('debug');
const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// const http = require('http');

const debug = debug_('webpub-protect');

debug(chalk.underline.bold.green('Starting ...'));

debug(`${chalk.green('process.cwd():')} ${process.cwd()}`);
debug(`${chalk.green('__dirname:')} ${__dirname}`);
debug(`${chalk.green('__filename:')} ${__filename}`);

const args = process.argv.slice(2);
debug(chalk.green('process.argv.slice(2): '));
debug('%o', args);

const setResponseCORS = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS'); // POST, DELETE, PUT, PATCH

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Accept-Ranges, Content-Range, Range, Link, Transfer-Encoding, X-Requested-With, Authorization, Accept, Origin, User-Agent, DNT, Cache-Control, Keep-Alive, If-Modified-Since',
  );

  res.setHeader(
    'Access-Control-Expose-Headers',
    'Content-Type, Content-Length, Accept-Ranges, Content-Range, Range, Link, Transfer-Encoding, X-Requested-With, Authorization, Accept, Origin, User-Agent, DNT, Cache-Control, Keep-Alive, If-Modified-Since',
  );
};

const expressApp = express();

// TODO: HTTP header `X-Robots-Tag` === `none`?
expressApp.get('/robots.txt', (_req, res) => {
  const robotsTxt = `User-agent: *
Disallow: /
`;
  res.header('Content-Type', 'text/plain');
  res.status(200).send(robotsTxt);
});

expressApp.get('/test', (req, res) => {
  const html = `\
<!DOCTYPE html>
<html>
<body>
<h1>TEST</h1>
</body>
</html>
`;

  setResponseCORS(res);
  res.set('Content-Type', 'text/html; charset=utf-8');

  const checkSum = crypto.createHash('sha256');
  checkSum.update(html);
  const hash = checkSum.digest('hex');

  const match = req.header('If-None-Match');
  if (match === hash) {
    res.status(304); // StatusNotModified
    res.end();
    return;
  }

  res.setHeader('ETag', hash);
  // res.setHeader("Cache-Control", "public,max-age=86400");

  res.status(200).send(html);
});

const staticOptions = {
  etag: false,
};
expressApp.use('/app', express.static('src/client/', staticOptions));
expressApp.use('/content', express.static('content/', staticOptions));

const headInject = `
<script type="text/javascript" src="/content/inject.js"></script>
`;

const routerProtect = express.Router({ strict: false });
routerProtect.get('/', (req, res, next) => {
  if (!req.params.asset) {
    req.params.asset = req._asset;
  }
  debug('req.params', req.params);
  debug('req.query', req.query);

  try {
    if (!/\.html?$/.test(req.params.asset)) {
      debug('skip', req.url);
      return next();
    }
    const fileStr = fs
      .readFileSync(path.join(process.cwd(), req.params.asset), {
        encoding: 'utf8',
      })
      .replace(/<\/head>/, `${headInject}</head>`);

    res.status(200).send(fileStr);
  } catch (err) {
    debug(err);
    res.status(500).send(`ASSET ERROR: ${req.params.asset}`);
  }
});
expressApp.param('asset', (req, _res, next, value, _name) => {
  req._asset = value;
  next();
});
expressApp.use('/protect/:asset(*)', routerProtect);
expressApp.use('/protect/content', express.static('content/', staticOptions));

expressApp.use((_req, res, _next) => {
  res.status(404).send('404');
});

const defaultPort = 3000;
let port = 0;
try {
  port = process.env.PORT ? parseInt(process.env.PORT, 10) : defaultPort;
} catch (err) {
  debug(err);
  port = defaultPort;
}
debug(`HTTP server port: ${port}`);

// const _httpServer = http.createServer({}, this.expressApp).listen(port, () => {
//   debug(`http://localhost:${port}`);
// });
const _httpServer = expressApp.listen(port, () => {
  debug(`http://localhost:${port}`);
});
