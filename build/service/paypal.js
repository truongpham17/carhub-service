"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gateway = void 0;

var _braintree = _interopRequireDefault(require("braintree"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const gateway = _braintree.default.connect({
  environment: _braintree.default.Environment.Sandbox,
  merchantId: 'wbh39k3n45dyg9gf',
  publicKey: 'qhxg3vc75s5ybbwg',
  privateKey: process.env.BRAIN_TREE_PRIVATE_KEY
});

exports.gateway = gateway;