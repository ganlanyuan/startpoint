      // HTML
const nunjucks = require('nunjucks'),
      w3cHtml = require('@ganlanyuan/w3cjs'),
      amphtmlValidator = require('amphtml-validator'),
      yaml = require('js-yaml'),
      // CSS
      sass = require('node-sass'),
      // sass = require("sass"),
      // Fiber = require("fibers"),
      postcss = require('postcss'),
      autoprefixer = require('autoprefixer'),
      normalize = require('postcss-normalize'),
      csso = require('postcss-csso'),
      request = require('request'), // for w3cCSS
      // localtunnel = require('localtunnel'),
      // JS
      rollup = require('rollup').rollup,
      resolve = require('rollup-plugin-node-resolve'),
      buble = require('rollup-plugin-buble'),
      uglify = require('rollup-plugin-uglify').uglify,
      globby = require('globby'), // for rollup
      // image
      imagemin = require('imagemin'),
      imageminPngquant = require('imagemin-pngquant'),
      // imageminJpegtran = require('imagemin-jpegtran'),
      imageminJpegRecompress = require('imagemin-jpeg-recompress'),
      imageminSvgo = require('imagemin-svgo'),
      imageminGifsicle = require('imagemin-gifsicle'),
      // amp
      uncss = require('uncss'),
      // server
      browserSync = require('browser-sync').create(),
      // helpers
      chokidar = require('chokidar'),
      chalk = require('chalk'),
      rimraf = require('rimraf'),
      fs = require('fs');
      path = require('path');

let source = 'src',
    assets = 'assets',
    njkDir = source + '/html',
    htmlDir = 'public',
    ampfile = htmlDir + '/amp.html',
    sassDir = source + '/scss',
    cssDir = assets + '/css',
    jsDir = source + '/js',
    imageDir = source + '/img',
    cssValidateLevel = 'css3',
    ampUncssIgnore = [],
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
  year: () => { return new Date().getFullYear(); }
};

let htmlValidatorFilters = [
      'The “banner” role is unnecessary for element “header”.', 
      'The “navigation” role is unnecessary for element “nav”.',
      'The “main” role is unnecessary for element “main”.',
      'The “contentinfo” role is unnecessary for element “footer”.'
    ];
  

switch (process.env.task) {
  case 'njk':
    doNunjucksAll();
    break;
  case 'htmlValidate':
    htmlValidator();
    break;
  // case 'ampValidate':
  //   ampValidator();
  //   break;
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
  // case 'amp':
  //   doAmp();
  //   break;

  default:
    serverUp();
    // watch njk files
    chokidar
      .watch([njkDir + '/**/*.njk', '*.njk'])
      .on('change', file => {
        if (_checkUnderscorePrefix(file)) {
          return doNunjucks(file);
        } else {
          return doNunjucks(njkDir + '/index.njk');
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
        doSassAll();
      });

    chokidar
      .watch(cssDir + '/**/*.css')
      .on('change', file => { cssValidator([file]); });

    // watch amp
    // chokidar
    //   .watch(cssDir + '/main.css')
    //   .on('change', () => doAmp());

    // chokidar
    //   .watch('amp.html')
    //   .on('change', ampValidator);
      
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
  let output = input.replace(njkDir, htmlDir).replace('.njk', '.html'),
      data = _loadData();

  let base = -1,
      IC = base,
      HC = base,
      PC = base,
      ICMax = data.I.length - 1,
      HCMax = data.H.length - 1,
      PCMax = data.P.length - 1;
  data.ic = () => {
    IC = IC >= ICMax ? 0 : IC + 1;
    return IC;
  };
  data.hc = () => {
    HC = HC >= HCMax ? 0 : HC + 1;
    return HC;
  };
  data.pc = () => {
    PC = PC >= PCMax ? 0 : PC + 1;
    return PC;
  };

  data = Object.assign(data, dataInit);

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
              str += m.type + ', line ' + m.lastLine + ', col ' + m.firstColumn + '-' + m.lastColumn + ', ' + m.message;
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
  let output = input.replace(source, assets).replace(/s[a|c]ss/g, 'css');
  sass.render({
    file: input,
    // outputStyle: 'compressed', // nested, expanded, compact, compressed
    outFile: output,
    sourceMap: true,
    precision: 7,
  }, (err, result) => {
    if (err) { return void console.log(err); }

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

  return globby.sync(files).map((inputFile) => {
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
                  keep_fnames: true, // keep function name
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

  return globby.sync(files).map((input) => {
    imagemin([input], {
      plugins: [
        imageminPngquant({quality: '65-80'}),
        // imageminJpegtran(),
        imageminJpegRecompress(),
        imageminSvgo({
          plugins: [
            {removeViewBox: false},
            {removeDimensions: false},
          ]
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
                   .replace(/fonts\/mnr/g, 'assets/css/fonts/mnr')
                   .replace(/!important/g, '')
                   .replace(/\@page\{.+/, '')
                   .replace(/\@media\sprint\{.+/, '')
                   .replace(/"..\/img/g, '"assets/img');
      fs.writeFile(ampfile, data.replace(/(\/\* inject:css \*\/)([\s|\S]*)(\/\* endinject \*\/)/, '$1\n    ' + css + '\n    $3'), (err) => {
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
    open: false,
    notify: false,
  }, () => { if (callback) { callback(); } });
}


















function _loadData () { return yaml.safeLoad(fs.readFileSync(njkDir + '/data.yml', 'utf8')); }

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