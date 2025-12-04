const DEMO_USER = {
  email: 'admin@sfb.local',
  password: 'admin123',
  name: 'Admin SFB',
};

exports.authenticateDemoUser = ({ email, password }) => {
  if (email === DEMO_USER.email && password === DEMO_USER.password) {
    return {
      token: 'demo-token-123',
      user: {
        name: DEMO_USER.name,
        email: DEMO_USER.email,
      },
    };
  }
  return null;
};


