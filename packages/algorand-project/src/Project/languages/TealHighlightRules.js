var MonacoAceTokenizer = require('monaco-ace-tokenizer');
var oop = MonacoAceTokenizer.oop;
var TextHighlightRules = MonacoAceTokenizer.TextHighlightRules;

var TealHighlightRules = function() {

    var keywords = (
      "intcblock|intc|intc_0|intc_1|intc_2|intc_3|bytecblock|bytec|bytec_0|bytec_1|bytec_2|bytec_3|" +
      "arg|arg_0|arg_1|arg_2|arg_3|txn|gtxn|global|load|store|" + 
      "err|pop|dup"
    );

    var functions = "sha256|keccak256|sha512_256|ed25519verify|len|itob|btoi|mulw"
    var pseudoOps = "int|byte|addr"

    var keywordMapper = this.createKeywordMapper({
        "variable.language": "this",
        "keyword": keywords,
        "function": functions,
        "type": pseudoOps
    }, "identifier");

    var decimalInteger = "(?:(?:[1-9]\\d*)|(?:0))";
    var octInteger = "(?:0[0-7]+)";
    var hexInteger = "(?:0[x][\\dA-Fa-f]+)";
    // var binInteger = "(?:0[bB][01]+)";
    var integer = "(?:" + decimalInteger + "|" + octInteger + "|" + hexInteger + ")";

    this.$rules = {
      "start" : [
        {
          token : "comment",
          regex : '\\/\\/.*?$'
        },
        {
          token: "type",
          regex: "addr\\s+",
          next: "addr"
        },
        {
          token: "type",
          regex: "(base32|b32)\\b",
          next: "base32"
        },
        {
          token: "type",
          regex: "(base64|bs64)\\b",
          next: "base64"
        },
        {
          token: "function",
          regex: "bnz\\b",
          next: "branch"
        },
        {
          token : "constant.string", // addr
          regex : "[A-Z0-9]{58}"
        },
        {
          token : "constant.numeric", // integer
          regex : integer + "\\b"
        },
        {
          token : "keyword.operator",
          regex : "\\+|\\-|\\*|\\/|<=|>=|<|>|&&|\\|\\||==|!=|!|%|\\||&|\\^|~"
        },
        {
          token : "function",
          regex : "sha256|keccak256|sha512_256|ed25519verify|len|itob|btoi|mulw"
        },
        {
          token : 'string',
          regex : "[a-zA-Z_][a-zA-Z0-9_]*:"
        },
        {
          token : keywordMapper,
          regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
        },
        {
          token : "text",
          regex : "\\s+"
        }
      ],
      "addr": [
        {
          token : "constant.string",
          regex : "[A-Z0-9]{58}",
          next: "start"
        },
      ],
      "base32": [
        {
          token : "constant.string",
          regex : "\\b[A-Z2-7]*\\s*$",
          next: "start"
        },
        {
          token : "constant.string",
          regex : "$",
          next: "start"
        }
      ],
      "base64": [
        {
          token : "constant.string",
          regex : "\\b[a-zA-Z0-9\\/\\+]*={0,2}\\s*$",
          next: "start"
        },
        {
          token : "constant.string",
          regex : "$",
          next: "start"
        }
      ],
      "branch": [
        {
          token : "string",
          regex : "\\b[a-zA-Z_][a-zA-Z0-9_]*\\s*$",
          next: "start"
        },
        {
          token : "string",
          regex : "$",
          next: "start"
        }
      ]
    };
};

oop.inherits(TealHighlightRules, TextHighlightRules);

export default TealHighlightRules;
