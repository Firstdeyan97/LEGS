const success = (res, message = "OK", data = null, code = 200) => {
    return res.status(code).json({
        status: "success",
        code: code,
        message: message,
        data: data,
        errors: null
    });
};

const error = (res, message = "Error", errors = null, code = 400) => {
    return res.status(code).json({
        status: "error",
        code: code,
        message: message,
        data: null,
        errors: errors
    });
};

module.exports = { success, error };