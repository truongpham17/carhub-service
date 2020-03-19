export default {
  account: {
    role: {
      ENUM: ['CUSTOMER', 'EMPLOYEE', 'MANAGER'],
    },
  },
  rental: {
    status: {
      ENUM: [
        'UPCOMING',
        'DECLINED',
        'CURRENT',
        'OVERDUE',
        'SHARING',
        'SHARED',
        'PAST',
      ],
    },
  },
  lease: {
    status: {
      ENUM: [
        'PENDING',
        'ACCEPTED',
        'DECLINED',
        'AVAILABLE',
        'HIRING',
        'WAIT_TO_RETURN',
        'PAST',
      ],
    },
  },
  transaction: {
    type: {
      ENUM: ['LEASE', 'RENTAL'],
    },
  },
};
