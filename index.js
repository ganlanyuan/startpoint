// HTML
import nunjucks from '/usr/local/lib/node_modules/nunjucks/index.js';
import w3cHtml from '/usr/local/lib/node_modules/@ganlanyuan/w3cjs/lib/w3cjs.js';
import amphtmlValidator from '/usr/local/lib/node_modules/amphtml-validator/index.js';
import yaml from '/usr/local/lib/node_modules/js-yaml/index.js';
// CSS
import sass from '/usr/local/lib/node_modules/node-sass/lib/index.js';
import postcss from '/usr/local/lib/node_modules/postcss/lib/postcss.js';
import autoprefixer from '/usr/local/lib/node_modules/autoprefixer/lib/autoprefixer.js';
import normalize from '/usr/local/lib/node_modules/postcss-normalize/index.cjs';
import csso from '/usr/local/lib/node_modules/postcss-csso/cjs/index.cjs';
import request from '/usr/local/lib/node_modules/request/index.js';
// JS
import { rollup } from '/usr/local/lib/node_modules/rollup/dist/rollup.js';
import resolve from '/usr/local/lib/node_modules/rollup-plugin-node-resolve/dist/rollup-plugin-node-resolve.cjs.js';
import buble from '/usr/local/lib/node_modules/rollup-plugin-buble/dist/rollup-plugin-buble.cjs.js';
import { uglify } from "/usr/local/lib/node_modules/rollup-plugin-uglify/index.js";
import {globby} from '/usr/local/lib/node_modules/globby/index.js';
import {globbySync} from '/usr/local/lib/node_modules/globby/index.js';
// image
import imagemin from '/usr/local/lib/node_modules/imagemin/index.js';
import imageminPngquant from '/usr/local/lib/node_modules/imagemin-pngquant/index.js';
import imageminJpegRecompress from '/usr/local/lib/node_modules/imagemin-jpeg-recompress/index.js';
import imageminSvgo from '/usr/local/lib/node_modules/imagemin-svgo/index.js';
import imageminGifsicle from '/usr/local/lib/node_modules/imagemin-gifsicle/index.js';
// amp
import uncss from '/usr/local/lib/node_modules/uncss/src/uncss.js';
// server
import browserSync from '/usr/local/lib/node_modules/browser-sync/dist/index.js';
// helpers
import chokidar from '/usr/local/lib/node_modules/chokidar/index.js';
import chalk from '/usr/local/lib/node_modules/chalk/source/index.js';
import { rimraf } from '/usr/local/lib/node_modules/rimraf/dist/esm/index.js';

import * as fs from 'node:fs';
import * as http from 'node:http';
import * as path from 'node:path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let baseurl = '',
    source = 'src',
    assets = 'assets',
    njkDir = source + '/html',
    htmlDir = 'public',
    ampfile = htmlDir + '/_amp.html',
    sassDir = source + '/scss',
    cssDir = assets + '/css',
    jsDir = source + '/js',
    imageDir = source + '/img',
    cssValidateLevel = 'css3',
    ampUncssIgnore = ['.img-on-left img', '.article-byline img', '.message-from img', '.topbar-news.slider-fallback li', '.slider-fallback'],
    publicUrl = '',
    tunnel,
    consoleHTML = chalk.blue('<HTML>'),
    consoleCSS = chalk.green('/CSS/'),
    consoleJS = chalk.magenta('{JS}'),
    consoleIMG = chalk.cyan('|IMG|');

// console.time("dbsave");
// console.log(_getAllFilesFromFolder(source, '.scss', _checkUnderscorePrefix));
// console.timeEnd("dbsave");
let dataInit = {
  is: (type, obj) => {
    var clas = Object.prototype.toString.call(obj).slice(8, -1);
    return obj !== undefined && obj !== null && clas === type;
  },
  keys: (obj) => { return Object.keys(obj); },
  belongTo: (str, arr) => { return arr.indexOf(str) !== -1; },
  push: (arr, str) => { arr.push(str); return arr; },
  date: () => { return new Date().toDateString().slice(4); },
  year: () => { return new Date().getFullYear(); }
};

let htmlValidatorFilters = [
      'The “banner” role is unnecessary for element “header”.',
      'The “navigation” role is unnecessary for element “nav”.',
      'The “main” role is unnecessary for element “main”.',
      'The “contentinfo” role is unnecessary for element “footer”.',
      'Bad value “sponsored” for attribute “rel” on element “a”: The string “sponsored” is not a registered keyword.'
    ];


switch (process.env.task) {
  case 'njk':
    doNunjucksAll();
    break;
  case 'htmlValidate':
    htmlValidator();
    break;
  case 'ampValidate':
    ampValidator();
    break;
  case 'sass':
    doSassAll();
    break;
  case 'cssValidate':
    cssValidator(_getAllFilesFromFolder(cssDir, '.css'));
    break;
  case 'js':
    doJsBundle();
    break;
  case 'image':
    minifyImage();
    break;
  case 'amp':
    doAmp();
    break;

  default:
    serverUp();
    // watch njk files
    chokidar
      .watch([njkDir + '/**/*.njk', 'site/index.njk', '*.njk'])
      .on('change', file => {
        if (_checkUnderscorePrefix(file)) {
          return doNunjucks(file);
        } else {
          // return doNunjucksAll();
          doNunjucks(njkDir + '/index.njk');
        }
      });

    chokidar
      .watch(htmlDir + '/**/*.html', {
        ignored: [htmlDir + '/amp.html', htmlDir + '/pages.html']
        // ignored: ['amp.html', 'pages.html', source + '/**/*', 'test/**/*', 'node_modules/**/*']
      })
      .on('change', file => { htmlValidator([file]); });

    // watch sass
    chokidar
      .watch(sassDir + '/**/*.scss')
      .on('change', file => {
        if (_checkUnderscorePrefix(file)) { return doSass(file); }
        // doSass(sassDir + '/ad.scss');
        doSassAll();
      });

    chokidar
      .watch(cssDir + '/**/*.css')
      .on('change', file => { cssValidator([file]); });

    // watch amp
    chokidar
      .watch([cssDir + '/main.css', ampfile])
      .on('change', () => doAmp());

    chokidar
      .watch(ampfile)
      .on('change', ampValidator);

    // watch JS
    chokidar
      .watch(jsDir + '/**/*.js')
      .on('change', file => {
        _checkUnderscorePrefix(file) ? doJsBundle(file) : doJsBundle();
      });

    // watch Images
    let imgWatcher = chokidar.watch(imageDir + '/**/*.{png,jpg,jpeg,svg,gif}');
    imgWatcher
      .on('change', file => minifyImage(file))
      .on('ready', () => {
        imgWatcher
          .on('add', file => minifyImage(file))
          .on('unlink', file => _rmFile(file.replace(source, assets)));
      });

    // watch server
    chokidar
      .watch([htmlDir + '/**/*.html', '*.html', cssDir + '/**/*.css', assets + '/js/**/*.js'], {
        ignored: [htmlDir + '/amp.html']
        // ignored: ['index.js', 'amp.html', source + '/**/*', 'test/**/*', 'node_modules/**/*']
      })
      .on('change', browserSync.reload);
}


function doNunjucksAll () {
  _getAllFilesFromFolder(njkDir, '.njk', _checkUnderscorePrefix).forEach((file) => {
    doNunjucks(file);
  });
}

function doNunjucks (input) {
  let dir = input === 'index.njk' ? '' : htmlDir + '/',
      filename = path.basename(input, path.extname(input)),
      output = dir + filename + '.html',
      data = _loadData(),
      count = {};

  for(var item in data) {
    if (Array.isArray(data[item])) {
      initCount(item);
    }
  }

  initCount('300x250', 1 , 17);
  initCount('160x600', 1 , 1);
  initCount('300x600', 1 , 8);
  initCount('728x90', 1 , 7);
  initCount('970x250', 1 , 3);

  function initCount (str, min, max) {
    if (min === undefined) { min = 0; }
    if (max === undefined) { max = data[str].length - 1; }

    count[str] = {
      current: min,
      min: min,
      max: max
    };
  }

  data.get = (str) => {
    let n = count[str].current;

    if (count[str].current >= count[str].max) {
      count[str].current = count[str].min;
    } else {
      count[str].current++;
    }

    return data[str] ? data[str][n] : n;
  }

  data = Object.assign(data, dataInit);
  data.filename = filename;

  let env = new nunjucks.Environment(new nunjucks.FileSystemLoader());
  env.addFilter('shorten', (str, count) => {
    return str.slice(0, count || 5);
  });
  env.addFilter('nameToUrl', (str) => {
    return str.toLowerCase().replace(/\s+[&]*\s*/g, '-').replace(/\.*/g, '');
  });
  env.addFilter('splitToArray', (str, separator) => {
    return str.split(separator);
  });
  env.addFilter('pushToArray', (arr, item) => {
    return arr.push(item);
  });
  env.addFilter('removeFromArray', (arr, item) => {
    arr.splice(arr.indexOf(item), 1);
    return arr;
  });

  env.render(input, data, (err, res) => {
    if (err) { return console.log(err); }

    _checkDir(path.dirname(output), () => {
      fs.writeFile(output, res, (err) => {
        if (err) { return console.log(err); }
        _colorConsole(consoleHTML, output);
      });
    });
  });
}

function htmlValidator (arr) {
  if (!arr) {
    arr = _getAllFilesFromFolder(htmlDir, '.html', (file) => {
            return ['amp', 'pages'].indexOf(path.basename(file, '.html')) < 0;
          }, ['assets', 'src', 'test', 'node_modules']);
  }

  arr.forEach((file, index) => {
    console.log(file);

    // output: json => Terminal
    w3cHtml.validate({
      file: file, // file can either be a local file or a remote file
      output: 'json',
      callback: (err, res) => {
        if (err) { return console.log(chalk.red(err)); }

        var str = '';
        if (res.messages.length > 0) {
          res.messages.forEach(m => {
            // check if messages match filters
            if (htmlValidatorFilters.indexOf(m.message) < 0) {
              str += m.type + ', line ' + m.lastLine + ', col ' + m.firstColumn + '-' + m.lastColumn + ', ' + m.message + '\n';
            }
          });

          // if there are some messages after filter
          // display them
          // var num = Math.round(Math.random() * 100);
          if (str.length > 0) { console.log(chalk.gray(res.context.replace('/www/web/', '') + ': \n' + str)); }
        }
      }
    });

    // output: html => file
    w3cHtml.validate({
      file: file, // file can either be a local file or a remote file
      output: 'html',
      callback: (err, res) => {
        if (err) { return console.log(chalk.red(err)); }

        res = res.slice(0, 38) + '<meta charset="utf-8">' + res.slice(38); // add charset

        let newDir = 'test/w3c/html/' + file.replace(htmlDir + '/', '');
        _checkDir(path.dirname(newDir), () => {
          fs.writeFile(newDir, res, err => {
            if(err) { return console.log(chalk.gray(err)); }
          });
        });
      }
    });
  });
}

function ampValidator () {
  fs.readFile(ampfile, 'utf8', (err, data) => {
    if (err) {
      console.log(chalk.red(err));
    } else {
      amphtmlValidator.getInstance().then(validator => {
        var result = validator.validateString(data);
        console.log(((result.status === 'PASS') ? chalk.green : chalk.red)('AMP ' + result.status));
        result.errors.forEach(error => {
          var msg = 'line ' + error.line + ', col ' + error.col + ': ' + error.message;
          if (error.specUrl) { msg += ' (see ' + error.specUrl + ')'; }
          console.log(((error.severity === 'ERROR') ? chalk.red : chalk.yellow)(msg));
        });
      });
    }
  })
}

function doSassAll () {
  _getAllFilesFromFolder(sassDir, '.scss', _checkUnderscorePrefix).forEach((file) => {
    doSass(file);
  });
}

function doSass (input) {
  // let t = Date.now();
  let output = input.replace(source, assets).replace(/s[a|c]ss/g, 'css');
  sass.render({
    file: input,
    // outputStyle: 'compressed', // nested, expanded, compact, compressed
    outFile: output,
    sourceMap: true,
    precision: 7,
  }, (err, result) => {
    if (err) { return void console.log(err); }
    // console.log(Date.now() - t);

    // SASS sourcemap
    fs.writeFile(output + '.map', result.map, (err) => {
      if (err) { return void console.log(err); }
      _colorConsole(consoleCSS, output + '.map');
    });

    // postCSS
    postcss([ autoprefixer, csso ]).process(result.css, {
      from: input,
      to: output,
      map: { inline: false }
    }).then((result) => {
      result.warnings().forEach((warn) => { console.warn(warn.toString()); });

      _checkDir(path.dirname(output), () => {
        fs.writeFile(output, result.css.replace('@charset "UTF-8";', ''), (er) => {
          if (er) { return void console.log(er); }
          _colorConsole(consoleCSS, output);
        });
      });
    });
  });
  // // dert sass
  // sass.render({
  //   file: input,
  //   // outputStyle: 'compressed', // nested, expanded, compact, compressed
  //   // importer: (url, prev, done) => {
  //   //   console.log(url);
  //   // },
  //   fiber: Fiber
  // }, (err, result) => {
  //   if (err) { return void console.log(err); }

  //   fs.writeFile(output, result.css, (er) => {
  //     if (er) { return void console.log(er); }

  //     console.log(output, 'saved!');
  //   });
  // });
}

function cssValidator (arr) {
  arr.forEach(file => {
    fs.readFile(file, {encoding: 'utf-8'}, (err, data) => {
      let css = data.replace(/\n\/\*.*\*\//g, '');
      request('https://jigsaw.w3.org/css-validator/validator?text=' + css + '&profile=' + cssValidateLevel + '&usermedium=all&warning=1&vextwarning=&lang=en', (error, response, body) => {

        if (error) { return console.log(chalk.red('CSS Validate Errors:', error)); }

        _colorConsole(consoleCSS, 'validating: ' + file.replace('/www/web/', '') +  response.statusCode);
        // console.log('body:', body); // Print the HTML
      })
      .pipe(fs.createWriteStream('test/w3c/css/' + path.parse(file).name + '.html'));
    });
  });
}

function doJsBundle (files) {
  if (!files) { files = jsDir + '/**/*.js'; }
  return globbySync(files).map((inputFile) => {
    if (_checkUnderscorePrefix(inputFile)) {
      let outputFile = inputFile.replace(source, assets),
          inputOptions = {
            input: inputFile,
            context: 'window',
            treeshake: false,
            plugins: [
              resolve({
                jsnext: true,
                main: true,
                browser: true,
              }),
              buble(),
              uglify({
                mangle: {
                  keep_fnames: true,
                }
              }),
            ],
          },
          outputOptions = {
            file: outputFile,
            format: 'iife',
            // name: 'site',
            sourcemap: true,
            // moduleName: 'tns',
          };

      async function build () {
        const bundle = await rollup(inputOptions);

        // console.log(bundle.imports); // an array of external dependencies
        // console.log(bundle.exports); // an array of names exported by the entry point
        // console.log(bundle.modules); // an array of module objects

        // generate code and a sourcemap
        // const { code, map } = await bundle.generate(outputOptions);

        // or write the bundle to disk
        await bundle.write(outputOptions);
        await _colorConsole(consoleJS, outputFile);
      }

      build();
    }
  });
}

function minifyImage (files) {
  if (!files) { files = imageDir + '/**/*.{png,jpg,jpeg,svg,gif}'}

  return globbySync(files).map((input) => {
    imagemin([input], {
      plugins: [
        imageminPngquant({quality: [0.65, 0.8]}),
        // imageminJpegtran(),
        imageminJpegRecompress(),
        imageminSvgo({
          plugins: [{
            name: 'removeViewBox',
            active: false
          }]
        }),
        imageminGifsicle(),
      ]
    }).then(outputs => {
      outputs.forEach(output => {
        let outputPath = input.replace(source, assets);
        _checkDir(path.dirname(outputPath), () => {

          fs.writeFile(outputPath, output.data, err => {
            if (err) { return console.log(err); }
            _colorConsole(consoleIMG, outputPath);
          });
        });
      });
    });
  });
}

function doAmp () {
  uncss([ampfile], {
    ignore: ampUncssIgnore,
    stylesheets: ['../' + cssDir + '/main.css']
  }, (err, res) => {
    if (err) { return console.log('doAmp', err); }

    fs.readFile(ampfile, {encoding: 'utf-8'}, (err, data) => {
      if (err) { return console.log(err); }

      let css = res.replace(/\s*\/\*.*\*\/\s*/g, '')
                   .replace(/\.\.\/img/g, baseurl + 'assets/img')
                   .replace(/\.\.\/fonts/g, baseurl + 'assets/fonts')
                   .replace(/!important/g, '')
                   .replace(/\@font-face\{[^\}]+\}/g, '')
                   .replace(/\@page\{.+/, '')
                   .replace(/\@media\sprint\{.+/, '')
                   .replace('.img-slider>div{background:#f0f0f0}', '')
                   .replace(/\simg/g, ' amp-img');
      fs.writeFile(ampfile.replace('_', ''), data.replace(/(\/\* inject:css \*\/)([\s|\S]*)(\/\* endinject \*\/)/, '$1\n    ' + css + '\n    $3'), (err) => {
        if (err) { return console.log(err); }
        _colorConsole(consoleHTML, 'amp.html');
      });
    });
  });
}

function serverUp (callback) {
  return browserSync.init({
    server: { baseDir: './'},
    ghostMode: false,
    ui: false,
    open: true,
    notify: false,
  }, () => { if (callback) { callback(); } });
}


















function _loadData () { return yaml.load(fs.readFileSync(njkDir + '/data.yml', 'utf8')); }

function _colorConsole (lang, str) {
  console.log(lang, chalk.gray(str + ' ✓'));
}

function _rmFile (file) {
  fs.unlink(file, err => {
    if (err) { return console.log(err); }
    console.log(chalk.gray(`${file} was deleted`));
  });
}

function _rmDir (dir) {
  rimraf(dir, function () { console.log(chalk.gray(`${dir} was deleted`)); });
}

function _checkDir (dir, callback) {
  if (!fs.existsSync(__dirname + '/' + dir)) { _mkDirByPathSync(dir); }
  if (callback) { callback(); }
}


// https://stackoverflow.com/questions/31645738/how-to-create-full-path-with-nodes-fs-mkdirsync#40686853
function _mkDirByPathSync (targetDir, {isRelativeToScript = true} = {}) {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';

  targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
      console.log(chalk.gray(`Directory /${childDir} created`));
    } catch (err) {
      if (err.code !== 'EEXIST') { throw err; }
    }
    return curDir;
  }, initDir);
}

function _getAllFilesFromFolder (dir, ext, filter, excludeDir) {
  let results = [];

  fs.readdirSync(dir).forEach(file => {
    file = dir + '/' + file;
    let stat = fs.statSync(file);

    if (stat && stat.isDirectory()) {
      results =
        !excludeDir || excludeDir.indexOf(file.replace(dir + '/', '')) < 0 ?
        results.concat(_getAllFilesFromFolder(file, ext, filter, excludeDir)) :
        results;
    } else {
      let add = true;
      if ((ext && path.extname(file) !== ext) || (filter && !filter(file))) { add = false; }

      if (add) { results.push(file); }
    }
  });

  return results;
};

function _checkUnderscorePrefix (file) {
  return path.basename(file).indexOf('_') !== 0;
}