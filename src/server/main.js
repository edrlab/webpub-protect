const chalk = require('chalk');
const debug_ = require('debug');
const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const cookieParser = require('cookie-parser');
// const http = require('http');

const debug = debug_('webpub-protect');

debug(chalk.underline.bold.green('Starting ...'));

debug(`${chalk.green('process.cwd():')} ${process.cwd()}`);
debug(`${chalk.green('__dirname:')} ${__dirname}`);
debug(`${chalk.green('__filename:')} ${__filename}`);

const args = process.argv.slice(2);
debug(chalk.green('process.argv.slice(2): '));
debug('%o', args);

const doObfuscateContentPaths = false;

// may need encodeURIComponent() at caller site on returned value
const obfuscateContentPath = (str) => {
  return Buffer.from(str).toString('base64');
};

// may need decodeURIComponent() from caller on passed argument
const deObfuscateContentPath = (str) => {
  return Buffer.from(str, 'base64').toString('utf8');
};

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

expressApp.use(cookieParser());

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
  setHeaders: (res, pathh, _stat) => {
    debug('STATIC: ', res.url, pathh);
  },
};
expressApp.use('/app', express.static('src/client/', staticOptions));
expressApp.use('/content', express.static('content/', staticOptions));

const routerProtect = express.Router({ strict: false });
routerProtect.get('/', (req, res, next) => {
  if (!req.params.asset) {
    req.params.asset = req._asset;
  }

  debug('req.url', req.url); // path local to this router
  debug('req.baseUrl', req.baseUrl); // path local to above this router
  debug('req.originalUrl', req.originalUrl); // full path (req.baseUrl + req.url)

  debug('req.params', req.params);
  debug('req.query', req.query);
  debug('req.headers', req.headers);

  let checkBoxes = {};
  const data = req.query.checkBoxes || req.cookies.checkBoxes;
  if (data) {
    checkBoxes = JSON.parse(data);
    debug(checkBoxes);

    res.cookie('checkBoxes', data, {
      signed: false,
    });
  }

  // req.params are already decodeURIComponent()
  const asset = doObfuscateContentPaths
    ? deObfuscateContentPath(req.params.asset)
    : req.params.asset;
  debug('asset', asset);

  const isSecureHttp =
    req.secure ||
    req.protocol === 'https' ||
    req.get('X-Forwarded-Proto') === 'https';
  debug('isSecureHttp', isSecureHttp);

  // let headInject1 = '';
  // if (doObfuscateContentPaths) {
  //   let asset_ = asset.split('/');
  //   asset_ = asset_.slice(0, asset_.length - 1);
  //   asset_.push(encodeURIComponent(req.params.asset));
  //   const baseUrl = `http${isSecureHttp ? 's' : ''}://${
  //     req.headers.host
  //   }/${asset_.join('/')}`;
  //   debug('baseUrl', baseUrl);
  //   headInject1 = `
  //   <base href="${baseUrl}" />
  //   `;
  // }

  if (checkBoxes.checkBox_2) {
    if (!req.headers.referer) {
      const str = `ASSET REFERER MISSING: ${asset}`;
      debug(str);
      return res.status(500).send(str);
    }
    const ref = req.headers.referer.replace(/^https?:\/\//, '');
    if (
      !ref.startsWith(`${req.headers.host}/app`) &&
      !ref.startsWith(`${req.headers.host}/protect/`)
    ) {
      const str = `ASSET REFERER INCORRECT: ${asset} [${req.headers.host}] (${ref} ===> ${req.headers.referer})`;
      debug(str);
      return res.status(500).send(str);
    }
  }

  try {
    if (!/\.html?$/.test(asset)) {
      debug('skip non HTML', req.url);
      return next();
    }
    const originalFileStr = fs
      .readFileSync(path.join(process.cwd(), asset), {
        encoding: 'utf8',
      })
      .replace(
        /<\/body[\s\S]*?>/gm,
        '<script type="text/javascript" src="/content/inject.js"></script></body>',
      );

    const responseStr = checkBoxes.checkBox_4
      ? `
<!DOCTYPE html>
<html>
<head>
<title>...</title>
<meta charset="UTF-8" />
<script type="text/javascript">
window.addEventListener('load', () => {
  setTimeout(() => {
    document.write(atob('${Buffer.from(originalFileStr).toString('base64')}'));
  }, 1000);
});
</script>
</head>
<body>
</body>
</html>
    `
      : originalFileStr;

    //     const bodyStart = originalFileStr.indexOf('<body');
    //     const bodyEnd = originalFileStr.indexOf('</body>', bodyStart);
    //     const bodyStr = originalFileStr.substr(bodyStart, bodyEnd - bodyStart + 7);

    //     const headInject2 = `
    //     <script id="scriptToRemove" type="text/javascript">
    //     window.__BODY__ = '${Buffer.from(bodyStr).toString('base64')}';
    //     </script>
    //     `;
    //     const responseStr = originalFileStr
    //       .replace(
    //         /<body[\s\S]*?<\/body>/gm,
    //         `<body style="padding-top: 2em; padding-bottom: 2em; margin: 0; border: 0; box-sizing: border-box; font-size: 2em; font-family: sans; background-color: white; color: black;">
    // <script type="text/javascript">
    // document.addEventListener("DOMContentLoaded", () => {
    //   const elToRemove = document.getElementById("scriptToRemove");
    //   elToRemove.parentElement.removeChild(elToRemove);

    //   document.body.replaceWith(new DOMParser().parseFromString(atob(window.__BODY__), "text/html").body);
    //   /*
    //   setTimeout(() => {
    //     const script = document.createElement("script");
    //     script.setAttribute("type", "text/javascript");
    //     script.setAttribute("src", "/content/inject.js");
    //     document.head.appendChild(script);
    //   }, 500);
    //   */
    // });
    // </script>
    // </body>
    // `,
    //       )
    //       .replace(/<head([\s\S]*?)>/gm, `<head$1>${headInject1}`)
    //       .replace(/<\/head>/, `${headInject2}</head>`);

    return res.status(200).type('text/html').send(responseStr);
  } catch (err) {
    const str = `ASSET ERROR: ${asset} (${err})`;
    debug(str);
    return res.status(500).send(str);
  }
});
expressApp.param('asset', (req, _res, next, value, _name) => {
  req._asset = value;
  next();
});
expressApp.use('/protect/:asset(*)', routerProtect);
expressApp.use('/protect/content', express.static('content/', staticOptions));

expressApp.use('/protect-root', (req, res) => {
  res.redirect(
    301,
    `/protect/${
      doObfuscateContentPaths
        ? encodeURIComponent(obfuscateContentPath('content/doc1.html'))
        : 'content/doc1.html'
    }?checkBoxes=${req.query.checkBoxes}&key1=value1&key2=value2#anchor`,
  );
});

expressApp.use((_req, res) => {
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
