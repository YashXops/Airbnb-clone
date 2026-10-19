const Joi = require("joi");

const ListingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required(),
        location: Joi.string().required(),
    }).required(),
});

const ReviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});

module.exports = { ListingSchema,ReviewSchema };