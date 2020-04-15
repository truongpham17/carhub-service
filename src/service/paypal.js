import braintree from 'braintree';

const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: 'wbh39k3n45dyg9gf',
  publicKey: 'qhxg3vc75s5ybbwg',
  privateKey: process.env.BRAIN_TREE_PRIVATE_KEY,
});

export { gateway };
