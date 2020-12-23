// Requirements
const express = require(`express`);
const path = require(`path`);
const ejs = require(`ejs`);
const fs = require(`fs`);

// Constants
const baseDir = path.join( __dirname, `/../` );

// Functions
const consoleOut = (level, source, msg) => console.log(`[${level.toUpperCase()}] [${source.toUpperCase()}] ${msg}`);
const info = (source, msg) => consoleOut(`info`, source, msg);
const error = (source, msg) => consoleOut(`error`, source, msg);
const warn = (source, msg) => consoleOut(`warn`, source, msg);

const getPath = rest => path.join(baseDir, rest);

function loadProjects () {
    // Loads projects from /projects.

    fs.access(getPath(`/projects`), err => {
        if (err) {
            error(`server`, `Project folder doesn't exist.`);
        } else {
            let projects = fs.readdirSync(getPath(`/projects`), { withFileTypes: true }).map(dir => dir.name);
            
            let loaded = 0;
            let notLoaded = 0;
            for (let project of projects) {
                let dir = `${baseDir}/projects/${project}`;
                let file = `${dir}/info.json`;

                try {
                    let data = fs.readFileSync(file);

                    data = JSON.parse(data);
                    PROJECTS.list[project] = data;
                    PROJECTS.list[project].img = `/projects/${project}/card-img.png`;
                    PROJECTS.list[project].link = `/projects/${project}`;

                    loaded ++;
                } catch (err) {
                    error(`server`, `Couldn't read JSON file for project "${project}". Error follows.`);
                    console.error(err)

                    notLoaded ++;
                }
            }

            if (notLoaded > 0) warn(`server`, `Couldn't load ${notLoaded}/${loaded + notLoaded} projects.`);
            if (!PROJECTS.loaded) info(`server`, `First time project load completed.`);
            PROJECTS.loaded = true;
        }
    });
}

// Express Setup
const app = express();

app.set(`view engine`, `ejs`);

const server = app.listen(80);

// Routing
app.use(`/lib`, express.static(getPath(`/lib`)));
app.use(`/img`, express.static(getPath(`/img`)));
app.use(`/projects`, express.static(getPath(`/projects`)));

app.get(`/`, (req, res) => res.render(getPath(`/src/landing.ejs`), { projects: PROJECTS }));

// Main
info(`server`, `Server started.`);

let PROJECTS = { loaded: false, list: {} };

loadProjects();
setInterval(loadProjects, 1e3 * 60);