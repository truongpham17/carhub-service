export default {
  account: {
    role: {
      ENUM: ['CUSTOMER', 'EMPLOYEE', 'MANAGER'],
    },
  },
  rental: {
    status: {
      ENUM: ['UPCOMING', 'CURRENT', 'OVERDUE', 'SHARING', 'SHARED', 'PAST'],
    },
  },
  lease: {
    status: {
      ENUM: [
        'PENDING',
        'UPCOMING',
        'DECLINE',
        'AVAILABLE',
        'HIRING',
        'WAIT_TO_RETURN',
        'PAST',
      ],
    },
  },
};
