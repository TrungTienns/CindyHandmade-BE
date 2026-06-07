const { check, validationResult } = require('express-validator');

// Lấy kết quả lỗi và trả về response
const runValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: errors.array()[0].msg, // Trả về lỗi đầu tiên
            errors: errors.array(),
        });
    }
    next();
};

const registerValidator = [
    check('name', 'Vui lòng nhập tên').not().isEmpty(),
    check('email', 'Vui lòng nhập email hợp lệ').isEmail(),
    check('password', 'Mật khẩu phải từ 6 ký tự trở lên').isLength({ min: 6 }),
    runValidation
];

const loginValidator = [
    check('email', 'Vui lòng nhập email hợp lệ').isEmail(),
    check('password', 'Vui lòng nhập mật khẩu').exists(),
    runValidation
];

module.exports = {
    registerValidator,
    loginValidator,
};
