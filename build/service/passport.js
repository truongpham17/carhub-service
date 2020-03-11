"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authJwt = exports.auth = exports.authLocal = void 0;

var _passport = _interopRequireDefault(require("passport"));

var _httpStatus = _interopRequireDefault(require("http-status"));

var _passportLocal = _interopRequireDefault(require("passport-local"));

var _passportJwt = require("passport-jwt");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _account = _interopRequireDefault(require("../module/account/account.model"));

var _manager = _interopRequireDefault(require("../module/manager/manager.model"));

var _customer = _interopRequireDefault(require("../module/customer/customer.model"));

var _employee = _interopRequireDefault(require("../module/employee/employee.model"));

var _constants = _interopRequireDefault(require("../config/constants"));

var _enum = _interopRequireDefault(require("../enum"));

var _user = _interopRequireDefault(require("../module/user/user.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const localOpts = {
  usernameField: 'username'
};
const localStrategy = new _passportLocal.default(localOpts, async (username, password, done) => {
  try {
    const user = await _user.default.findOne({
      username
    });

    if (!user) {
      return done(null, false);
    }

    if (!user.validatePassword(password)) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
});

_passport.default.use(localStrategy);

const authLocal = async (req, res, next) => _passport.default.authenticate('local', {
  session: false
}, (err, user) => {
  if (err) {
    return res.status(_httpStatus.default.UNAUTHORIZED).json('Invalid username or password');
  }

  if (!user) {
    return res.status(_httpStatus.default.UNAUTHORIZED).json('Invalid username or password');
  }

  return res.status(_httpStatus.default.OK).json(user.toAuthJSON());
})(req, res, next);

exports.authLocal = authLocal;
const jwtOpts = {
  jwtFromRequest: _passportJwt.ExtractJwt.fromExtractors([_passportJwt.ExtractJwt.fromHeader('token'), req => req.params.token]),
  secretOrKey: _constants.default.JWT_SECRET
};
const jwtStrategy = new _passportJwt.Strategy(jwtOpts, async (payload, done) => {
  try {
    const user = await _user.default.findOne({
      _id: payload._id
    });

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

_passport.default.use(jwtStrategy);

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(_httpStatus.default.UNAUTHORIZED).json('Unnauthorized');
    }

    const token = authHeader.replace('Bearer ', '');
    let decodedToken;

    try {
      decodedToken = _jsonwebtoken.default.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return res.status(_httpStatus.default.UNAUTHORIZED).json('Unauthorized');
    }

    const {
      _id
    } = decodedToken;

    if (!decodedToken || !_id) {
      return res.status(_httpStatus.default.UNAUTHORIZED);
    }

    const user = await _account.default.findOne({
      _id,
      isActive: true
    });
    req.user = user;

    if (user.role === 'MANAGER') {
      const manager = await _manager.default.findOne({
        account: user._id
      });
      req.manager = manager;
    }

    if (user.role === 'EMPLOYEE') {
      const employee = await _employee.default.findOne({
        account: user._id
      });
      req.employee = employee;
    }

    if (user.role === 'CUSTOMER') {
      const customer = await _customer.default.findOne({
        account: user._id
      });
      req.customer = customer;
    }

    return next();
  } catch (error) {
    next(error);
  }
};

exports.auth = auth;

const authJwt = _passport.default.authenticate('jwt', {
  session: false
});

exports.authJwt = authJwt;