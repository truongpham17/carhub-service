export default {
  account: {
    role: {
      ENUM: ['NONE', 'MALE', 'FEMALE'],
    },
  },
  rental: {
    status: {
      ENUM: ['UPCOMING', 'CURRENT', 'OVERDUE', 'SHARING', 'SHARED', 'PAST'],
    },
  },
  lease: {
    status: {
      ENUM: ['Pending', 'Available', 'Hiring', 'WAIT_TO_RETURN', 'PAST'],
    },
  },
};
