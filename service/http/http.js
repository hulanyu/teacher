const http = require('http');
const path = require('path');
const fs = require('fs');
const cp = require('child_process');

const BASE_URL = path.join(__dirname, '../../dist');

function pms (content) {
    return new Promise((resolve, reject) => {
        try {
            resolve(content())
        } catch (error) {
            reject(error)
        }
    })
}
async function sendHTML(data) {
    let sendText;
    try {
        const html = await fs.readFileSync(path.join(__dirname, './index.html'), 'utf-8')
        sendText = html.replace(/\<%%\>/, data)
    } catch (error) {
        sendText = 'not found'
    }
    return sendText;
}
const server = http.createServer(async (req, res) => {
    let reqURL;
    if (req.url === '/') {
        reqURL = '/index.html';
    } else if (req.url.indexOf('.') === -1) {
        reqURL = req.url + '.html'
    } else {
        reqURL = req.url
    }

    try {
        const stats = fs.statSync(BASE_URL)
        if (!stats.isDirectory()) {
            res.end(await sendHTML('dist不是目录'));
        }
        try {
            res.end(fs.readFileSync(path.join(BASE_URL, reqURL)));
        } catch (error) {
            res.end(await sendHTML('未找到index.html'));
        }
    } catch (error) {
        try {
            res.end(await sendHTML('未找到dist目录, 请build'));
        } catch (error) {
            res.end('500')
        }
    }
})

const PORT = 9090;
const HOST = 'localhost';
server.listen({
    port: PORT,
    host: HOST,
}, () => {
    const t = `start http://${HOST}:${PORT}`;
    console.log(t);
    cp.exec(t);
});