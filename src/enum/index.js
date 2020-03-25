export default {
  account: {
    role: {
      ENUM: ['CUSTOMER', 'EMPLOYEE', 'MANAGER'],
    },
  },
  rental: {
    status: {
      ENUM: [
        'UPCOMING', // Customer request hire car
        'DECLINED', // Employee decline customer's request
        'CURRENT', // Customer get rental car
        'OVERDUE', // Customer out of date car rental
        'SHARING', // Customer share their rental car
        'SHARED', // Customer shared their rental car
        'PAST', // Customer's rental car returned to hub and complete
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
};
