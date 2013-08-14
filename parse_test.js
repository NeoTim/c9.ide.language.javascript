/*global describe it before*/

if (typeof process !== "undefined") {
    require("amd-loader");
    require("../../test/setup_paths");
}

define(function(require, exports, module) {
    var assert          = require("ace/test/assertions");
    var handler         = require("./parse");
    var scopeHandler    = require("./scope_analyzer");
    var LanguageWorker  = require('plugins/c9.ide.language/worker').LanguageWorker;
    var EventEmitter    = require("ace/lib/event_emitter").EventEmitter;
    
    describe("Parse", function(){
        it("test parsing", function(done) {
            var emitter = Object.create(EventEmitter);
            emitter.emit = emitter._dispatchEvent;
            var worker = new LanguageWorker(emitter);
            worker.register("ext/jslanguage/parse");
            assert.equal(worker.handlers.length, 1);
            worker.switchFile("test.js", "javascript", "hello();", null, "");
            worker.parse(null, function(ast) {
                assert.equal(ast, '[Call(Var("hello"),[])]');
                done();
            });
        });
        it("test basic recovery", function(done) {
            var emitter = Object.create(EventEmitter);
            emitter.emit = emitter._dispatchEvent;
            var worker = new LanguageWorker(emitter);
            worker.register("ext/jslanguage/parse");
            assert.equal(worker.handlers.length, 1);
            worker.switchFile("test.js", "javascript", "hello(", null, "");
            worker.parse(null, function(ast) {
                assert.equal(ast, '[Call(Var("hello"),[])]');
                done();
            });
        });
        it("test follow by whitespace", function(done) {
            var emitter = Object.create(EventEmitter);
            emitter.emit = emitter._dispatchEvent;
            var worker = new LanguageWorker(emitter);
            worker.register("ext/jslanguage/parse");
            assert.equal(worker.handlers.length, 1);
            worker.switchFile("test.js", "javascript", "console.log\n\n\n\n", null, "");
            worker.parse(null, function(ast) {
                assert.equal(ast, '[PropAccess(Var("console"),"log")]');
                done();
            });
        });
    });
});