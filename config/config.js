/**
 * 全局配置文件
 */
// 获取所有页面 生成多页面的集合
let fs = require('fs');
const getFileNameList = path => {
    let fileList = [];
    let dirList = fs.readdirSync(path);
    dirList.forEach(item => {
        if (item.indexOf('html') > -1) {
            fileList.push(item.split('.')[0]);
        }
    });
    return fileList; //返回当前html文件夹下的所有文件名组成的数组
};

module.exports = {
    HTMLDirs: getFileNameList('./src/view'),
    rootPath: '../',
    staticPath: 'static/',
    distPath: '../dist'
}