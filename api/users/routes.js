const theFramework = require('the-framework');
const { fetchUserFromDatabase } = require('../../services/firebase/fetch-user-information');

theFramework.get(
  '/users/:user_id',
  [
    {
      id: 'user_id',
      type: theFramework.INTEGER,
      required: true,
      description: 'user db id',
    },
  ],
  {
    description: 'gets user profile information',
    authRequired: false,
  },
  // Takes 'params' as first and 'user' as second argument
  async ({ user_id: userId }) => ({ userInfo: await fetchUserFromDatabase(userId) }),
);
