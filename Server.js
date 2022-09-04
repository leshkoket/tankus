"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
const http = require('http');
const fs = require('fs');
//import * as fs from 'fs/promises';
//import * as fs from 'fs/promises';
class MyServer {
    constructor() {
        this._pagesToLoad = new Map();
        this._lastPushedData = null;
    }
    run() {
        //const hostname = '127.0.0.1'; const port = 3000;
<<<<<<< HEAD
        console.log( "$"+process );
        const hostname = ''; const port = process.env.PORT || 3000;
        const my = this;
        const server = http.createServer((i, o) => { MyServer.handle(my, i, o); });
        //this.loadPage('Index.html');
        //this.loadPage('Scripts/Client.js');
        server.listen(port, () => {
=======
        const hostname = ';http://leshkokoteshko.ap-1.evennode.com/'; const port = 80;
        const my = this;
        const server = http.createServer((i, o) => { MyServer.handle(my, i, o); });
        this.loadPage('Index.html');
        //this.loadPage('Scripts/Client.js');
        server.listen(port, hostname, () => {
>>>>>>> master
            console.log(`Server running at http://${hostname}:${port}/`);
        });
    }
    loadPage(name) {
        let text = this.readText(name);
        console.log(`page <${name}>`);
        console.log(`"${text}"\n`);
        this._pagesToLoad.set(name, text);
    }
    readText(fileName) {
        try{
            if( fileName.startsWith("/") ) fileName = fileName.slice(1) ;
            let path = fs.realpathSync(fileName);
            console.log("at: {" + path + "}");
            let text = fs.readFileSync(path);
            return text;
        }
        catch( error ){
            console.log( "ERROR :"+ error +" AT "+fs.realpathSync(fileName));
            return null;
        }
    }
    getPageText(name) {
        if (name.startsWith('/')) {
            name = name.slice(1);
        }
        let result = this._pagesToLoad.get(name);
        return "" + result;
    }
    static handle(my, input, output) {
        var input_1, input_1_1;
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const url = ("" + input.url);
            const outUrl = url;
            let contentType = 'text/plain';
            let content = null;
            
            output.statusCode = 200;
            
            if (url.endsWith('.js')) {
                content = my.readText(outUrl);
                contentType = 'text/javascript';
            }
            else if(url.endsWith('.css')) {
                content = my.readText(outUrl);
                contentType = 'text/css';
            }
            else if( url.endsWith('.png')  ){
                content = my.readText(outUrl);
                contentType  = 'image/png';
            }
            else if (url.endsWith('.html')) {
                content = my.readText(outUrl);
                contentType = 'text/html';
            }
            else if (outUrl == '' || outUrl == '/') {
                content = my.readText('Index.html');
                contentType = 'text/html';
            }
            
            if( content == null ){
                output.statusCode = 404;
            }
            console.log("$" + url + "::" + input.url + "$=>" + outUrl + "::");
            //console.log(content);
            output.setHeader('Content-Type', contentType);
            output.end(content);
        });
    }
}
new MyServer().run();
