const faqService = require('../utils/faqService');

const getResponse = (message) => {
    return faqService.getAnswer(message.toLowerCase());
};

module.exports = {
    getResponse,
};
