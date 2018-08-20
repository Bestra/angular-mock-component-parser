let fs = require("fs");
let path = require("path");
let parse5 = require("parse5");

let filePath = path.join(__dirname, "test.html");
let f = fs.readFileSync(filePath, {
  encoding: "utf8"
});

const documentFragment = parse5.parseFragment("<div></div>");
const document = parse5.parseFragment(documentFragment.childNodes[0], f);

let matchedNodes = {};
let traverse = node => {
  if (!node.childNodes) {
    return;
  }
  node.childNodes.forEach(c => {
    if (c.tagName) {
      if (c.tagName.match(/app-/)) {
        matchedNodes[c.tagName] = c;
      }
    }
    traverse(c);
  });
};

traverse(document);

let getAttrs = (startsWith, node) => {
  return node.attrs
    .filter(a => a.name.startsWith(startsWith))
    .map(a => a.name.slice(1, -1));
};

let out = Object.keys(matchedNodes).map(k => {
  let c = matchedNodes[k];
  return {
    selector: c.tagName,
    inputs: getAttrs("[", c),
    outputs: getAttrs("(", c)
  };
});

console.log(out);
