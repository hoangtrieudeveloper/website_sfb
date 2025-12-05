const { authenticateDemoUser } = require('../services/auth.service');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    const result = await authenticateDemoUser({ email, password });

    if (result) {
      return res.json({
        success: true,
        ...result,
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Email hoặc mật khẩu không đúng hoặc tài khoản bị khoá',
    });
  } catch (error) {
    return next(error);
  }
};

