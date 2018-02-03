class InvalidArgumentError extends Error {
    constructor(actualType, expectedType) {
        super(`Received invalid type: ${actualType}, Expected Type ${expectedType}`);
        this.actualType = actualType;
        this.expectedType = expectedType;
        Error.captureStackTrace(this, InvalidArgumentError);
    }
}

module.exports = InvalidArgumentError;
