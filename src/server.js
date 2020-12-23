// Requirements
const express = require(`express`);
const path = require(`path`);
const ejs = require(`ejs`);

// Constants
const baseDir = path.join( __dirname, `/../` );

// Functions
const consoleOut = (level, source, msg) => console.log(`[${level.toUpperCase()}] [${source.toUpperCase()}] ${msg}`);
const info = (source, msg) => consoleOut(`info`, source, msg);

const getPath = rest => path.join(baseDir, rest);


// Express Setup
const app = express();

app.set(`view engine`, `ejs`);

const server = app.listen(80);

// Routing
app.use(`/lib`, express.static(getPath(`/lib`)));
app.use(`/img`, express.static(getPath(`/img`)));

app.get(`/`, (req, res) => res.render(getPath(`/src/landing.ejs`)));

// Main
info(`server`, `Server started.`);