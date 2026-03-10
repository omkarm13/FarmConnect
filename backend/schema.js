const Joi = require('joi');

module.exports.vegetableSchema = Joi.object({

        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        category: Joi.string().required().valid('roots', 'leaves', 'pods', 'flowers', 'fruits'),
        quantity: Joi.number().required().min(0),
        price: Joi.number().required().min(0),
        image: Joi.string().allow("", null),

});


module.exports.reviewSchema = Joi.object({
        review: Joi.object({
                rating: Joi.number().required().min(1).max(5),
                comment: Joi.string().required(),
        }).required(),
});