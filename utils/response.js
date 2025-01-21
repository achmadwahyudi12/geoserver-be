const response_success = ({ message, data }) => {
    return {
        code: 200,
        status: true,
        message,
        data,
    };
};

const response_error = ({ code, message }) => {
    return {
        code,
        status: false,
        message,
    };
}

module.exports = {
    response_success,
    response_error,
};