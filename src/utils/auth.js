export const authAdminOrUser = (req, id) =>
  req.user.role === 'ADMIN' || req.user._id.toString() === id.toString();
