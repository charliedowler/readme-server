// github.com style (c) Vasily Polovnyov <vast@whiteants.net>

module.exports = (function () {/*
 <style type='text/css'>
 .main {
 color: #333;
 font-family: Helvetica, arial, freesans, clean, sans-serif, 'Segoe UI Emoji', 'Segoe UI Symbol';
 size: 1.4em;
 text-align: left;
 width: 790px;
 display: block;
 border: 1px solid #ddd;
 border-top-left-radius: 7px;
 border-top-right-radius: 7px;
 padding: 20px;
 }

 code {
 padding: 0.2em 0;
 margin: 0;
 border-radius: 3px;
 background-color: #eee;
 font: 12px Consolas, 'Liberation Mono', Menlo, Courier, monospace;
 font-size: 100%;
 }

 code:before, code:after {
 letter-spacing: -0.2em;
 content: '\00a0';
 }

 pre {
 padding: 16px;
 overflow: auto;
 border-radius: 3px;
 margin-bottom: 16px;
 background-color: #eee;
 }

 pre code:before, pre code:after {
 content: normal;
 }

 li {
 line-height: 1.6;
 }

 h1 {
 width: 100%;
 border-bottom: 1px solid #ddd;
 }

 #notify {
 color: #f00;
 }

 .hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  color: #333;
  background: #f8f8f8;
  -webkit-text-size-adjust: none;
 }

 .hljs-comment,
 .diff .hljs-header,
 .hljs-javadoc {
  color: #998;
  font-style: italic;
 }

 .hljs-keyword,
 .css .rule .hljs-keyword,
 .hljs-winutils,
 .nginx .hljs-title,
 .hljs-subst,
 .hljs-request,
 .hljs-status {
  color: #333;
  font-weight: bold;
 }

 .hljs-number,
 .hljs-hexcolor,
 .ruby .hljs-constant {
  color: #008080;
 }

 .hljs-string,
 .hljs-tag .hljs-value,
 .hljs-phpdoc,
 .hljs-dartdoc,
 .tex .hljs-formula {
  color: #d14;
 }

 .hljs-title,
 .hljs-id,
 .scss .hljs-preprocessor {
  color: #900;
  font-weight: bold;
 }

 .hljs-list .hljs-keyword,
 .hljs-subst {
  font-weight: normal;
 }

 .hljs-class .hljs-title,
 .hljs-type,
 .vhdl .hljs-literal,
 .tex .hljs-command {
  color: #458;
  font-weight: bold;
 }

 .hljs-tag,
 .hljs-tag .hljs-title,
 .hljs-rules .hljs-property,
 .django .hljs-tag .hljs-keyword {
  color: #000080;
  font-weight: normal;
 }

 .hljs-attribute,
 .hljs-variable,
 .lisp .hljs-body {
  color: #008080;
 }

 .hljs-regexp {
  color: #009926;
 }

 .hljs-symbol,
 .ruby .hljs-symbol .hljs-string,
 .lisp .hljs-keyword,
 .clojure .hljs-keyword,
 .scheme .hljs-keyword,
 .tex .hljs-special,
 .hljs-prompt {
  color: #990073;
 }

 .hljs-built_in {
  color: #0086b3;
 }

 .hljs-preprocessor,
 .hljs-pragma,
 .hljs-pi,
 .hljs-doctype,
 .hljs-shebang,
 .hljs-cdata {
  color: #999;
  font-weight: bold;
 }

 .hljs-deletion {
  background: #fdd;
 }

 .hljs-addition {
  background: #dfd;
 }

 .diff .hljs-change {
  background: #0086b3;
 }

 .hljs-chunk {
  color: #aaa;
 }
 </style>
 */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];