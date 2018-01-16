let fs = require('fs');
let pathUtil = require('path');
let minify = require('html-minifier').minify;
let genDistPath = pathUtil.join(__dirname, 'src', '.tmp', 'release');
let genPath = pathUtil.join(__dirname, 'src', '.tmp');
let lessFilePool = [];
let handledLessFileCount = 0;

let tsFileTester = /\.ts$/;

let stylesRegex = /styleUrls *:(\s*\[[^\]]*?\])/g;
let htmlRegex = /templateUrl\s*:\s*\'(\S*?)\'/g;
let imageRegex = /url\([\'\"](\S*?\.png)[\'\"]\)/g;

let stringRegex = /(['"])((?:[^\\]\\\1|.)*?)\1/g;
let lessNumRegex = /style_(\d+)_less/g;

function getTsFile(path, parse) {
    try {
        if (fs.statSync(path).isFile() && tsFileTester.test(path)) {
            parse(path)
        } else if (fs.statSync(path).isDirectory() && path.indexOf(genDistPath) < 0) {
            // 单是一个文件夹且不是dist文件夹的情况下
            let paths = fs.readdirSync(path);
            paths.forEach(function (p) {
                getTsFile(pathUtil.join(path, p), parse);
            })
        }
    } catch (err) {
        console.log(path);
        // throw err;
    }
}

function transformHtmlUrls(path) {
    let content = fs.readFileSync(path);
    if (htmlRegex.test(content)) {
        let contentTemp = content.toString().replace(htmlRegex, function (match, url) {
            let filePath = pathUtil.resolve(pathUtil.dirname(path), url);
            let content = fs.readFileSync(filePath);
            let html = minify(content.toString(), {
                removeComments: true,
                collapseWhitespace: true,
                // removeEmptyAttributes: true,
                // removeAttributeQuotes: true
            });
            return 'template: ' + "`" + html + "`";
        });
        fs.writeFileSync(path, contentTemp);
    }
}

function transFormStyleUrls(path) {
    let content = fs.readFileSync(path);
    if (stylesRegex.test(content)) {
        let contentTemp = content.toString().replace(stylesRegex, function (match, url) {
            return 'styles: [``]'
        });
        fs.writeFileSync(path, contentTemp);
    }
}

function doneOne() {
    handledLessFileCount += 1;
    // 说明所有处理完成。
    if (handledLessFileCount === lessFilePool.length) {
        writeBack();
    }
}

function writeBack() {
    console.log("start to write back");
    getTsFile(genPath, writeBackCss);
    console.log('Done');
}

function process() {
    getTsFile(genPath, transformHtmlUrls);
    getTsFile(genPath, transFormStyleUrls);
}

console.log('prepare...');
// 转换操作
process();