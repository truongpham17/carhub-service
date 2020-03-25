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
        'PENDING', // Customer request lease their car
        'ACCEPTED', // Employee accepted customer's request
        'DECLINED', // Employee decline customer's request
        'AVAILABLE', // Customer send the car to the hub for rent or their car have been rented and are at the hub
        'HIRING', // Customer's car being hired by someone else
        'WAIT_TO_RETURN', // Customer's car are at the hub and wait for customer get back
        'PAST', // Customer get their car and complete
      ],
    },
  },
  transaction: {
    type: {
      ENUM: ['LEASE', 'RENTAL'],
    },
  },
  log: {
    type: {
      ENUM: [''],
    },
  },
};
