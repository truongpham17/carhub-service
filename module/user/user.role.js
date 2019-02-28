import HTTPStatus from 'http-status';

export function OwnOrAdmin(req, res, next) {
  if (req.user.role === 2 || req.params.id === req.user._id.toString()) {
    return next();
  }
  return res.sendStatus(HTTPStatus.FORBIDDEN);
}