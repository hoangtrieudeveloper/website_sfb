const { authenticateDemoUser } = require('../services/auth.service');

exports.login = (req, res) => {
  const { email, password } = req.body || {};

  const result = authenticateDemoUser({ email, password });

  if (result) {
    return res.json({
      success: true,
      ...result,
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Email hoặc mật khẩu không đúng',
  });
};




