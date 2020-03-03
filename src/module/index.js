import userRoutes from './user/user.routes';
import bookRoutes from './test/book.routes';
import accountRoutes from './account/account.routes';
import customerRoutes from './customer/customer.routes';
import employeeRoutes from './employee/employee.routes';

import managerRoutes from './manager/manager.routes';

export default app => {
  app.use('/user', userRoutes);
  app.use('/book', bookRoutes);
  app.use('/account', accountRoutes);
  app.use('/customer', customerRoutes);
  app.use('/employee', employeeRoutes);

  app.use('/manager', managerRoutes);
};
