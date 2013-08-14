/*global describe it before*/

if (typeof process !== "undefined") {
    require("amd-loader");
    require("../../test/setup_paths");
}

function outlineSync(handler, document, node) {
    var result;
    handler.outline(document, node, function(o) {
        result = o.body;
    });
    return result;
}

define(function(require, exports, module) {
    var handler  = require("ext/jslanguage/outline");
    var parser   = require("treehugger/js/parse");
    var assert   = require("ace/test/assertions");
    var Document = require("ace/document").Document;
    
    //var microtime = require("microtime");
    
    describe("Outline", function(){
        it("test basic outline", function(done) {
            var testfile = "" + require('text!ext/jslanguage/test/test1.js');
            var node = parser.parse(testfile);
            console.log(Document);
            var outline = outlineSync(handler, new Document(testfile), node);
            //console.log(""+node);
            //console.log(JSON.stringify(outline, null, 2));
            assert.equal(outline[0].name, 'simpleFunction()');
            assert.equal(outline[1].name, 'simpleFunctionNested(a, b)');
            assert.equal(outline[1].items[0].name, 'nested(c)');
            assert.equal(outline[2].name, 'someFunction(a, b)');
            assert.equal(outline[3].name, 'bla()');
            done();
        });
    
        it("test jquery", function(done) {
            //var now = microtime.now();
            var testfile = "" + require('text!jquery.js');
            var node = parser.parse(testfile);
            //console.log("Parsing time: " + (microtime.now() - now)/1000 + "ms");
            //var now = microtime.now();
            var outline = outlineSync(handler, new Document(testfile), node);
            //console.log("Outline time: " + (microtime.now() - now)/1000 + "ms");
            done();
        });
    });
});