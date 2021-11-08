const Product = require('../models/Product');
// CRUD
// GET
// POST
// PATCH - Remember Idempotency!
// DELETE

const getAllProducts = async (req, res) => {
    // Destructure specific values in the query.
    // These are specific keywords we are looking for.
    const { featured, company, name, sort, fields, numericFilters } = req.query;
    // Create an empty object called queryObject.
    // Use this to set keyword values.
    const queryObject = {}

    // Check if the 'featured' keyword was in the query.
    if (featured) {
        // If it was, set it to true or false based on the value
        // passed in the query.
        queryObject.featured = featured === 'true' ? true : false;
    }
    
    // Check if the 'company' keyword was in the query.
    if (company) {
        // If it was, set it to the value that was
        // passed in the query.
        queryObject.company = company;
    }

    // Check if the 'name' keyword was in the query.
    if (name) {
        // If it was, set it to the value that was
        // passed in the query.
        queryObject.name = { $regex: name, $options: 'i' };
    }

    if (numericFilters) {
        const operatorMap = {
            '>':'$gt',
            '>=':'$gte',
            '<':'$lt',
            '<=':'$lte',
            '=':'$eq'
        };

        const regEx = /\b(<|<=|=|>=|>)\b/g;
        let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
        const options = ['price', 'rating'];
        filters = filters.split(',').forEach((item) => {
            const [field,operator,value] = item.split('-');
            if (options.includes(field)) {
                queryObject[field] = { [operator]: Number(value) }
            }
        });
    }

    // Set result to the Product.find function with passing the
    // queryObject as a parameter.
    // This isn't invoked until we await it.
    let result = Product.find(queryObject);

    // Since we have our Product.find function set up,
    // we can check to see if any sort values were
    // passed and chain the sort function to the 
    // Product.find function.

    // Check if the 'sort' keyword was in the query.
    if (sort) {
        // If it was, split the sort array by
        // commas and join it back together using
        // spaces. This is critical because MongoDB
        // sorts keywords separated by spaces and not
        // commas.
        const sortList = sort.split(',').join(' ');

        // Chain the sort function on the result
        // and pass the new sortList string as
        // a parameter.
        result = result.sort(sortList);
    }
    else {
        // If it wasn't, sort the products by the
        // date each product was created.
        // This gives us the functionality
        // of sorting all the products based
        // on the date they were created by
        // default.
        result = result.sort('createdAt');
    }

    // Check if the fields keyword was in the query.
    if (fields) {
        // If it was, split the fields array by commas
        // and join it back together using spaces.
        // This is critical because MongoDB
        // selects keywords separated by spaces and not
        // commas.
        const fieldsList = fields.split(',').join(' ');

        // Chain the select function on the result
        // and pass the new fieldsList string as
        // a parameter.
        result = result.select(fieldsList);
    }

    // The page keyword enables us to implement
    // pagination.
    // We get the page keyword out of the query here
    // because it's passed as a string and we need
    // to convert it to a number.
    // If it doesn't exist in the query, page
    // defaults to 1;
    const page = Number(req.query.page) || 1;

    // The limit keyword specifies how many
    // products we're gonna show per page.
    // We get the limit keyword out of the query here
    // because it's passed as a string and we need
    // to convert it to a number.
    // If it doesn't exist in the query, limit
    // defaults to 10.
    const limit = Number(req.query.limit) || 10;

    // The skip variable is not passed via query.
    // It is the result of multiplying the
    // page - 1 by the limit.
    // The logic is that this will be the value
    // to determine which products are shown on each page.
    const skip = (page - 1) * limit;

    // Chain the skip and limit functions on
    // to the result.
    // We use no conditional checking here
    // since both page and limit are given default
    // values and therefor, logically, skip
    // will have a default value.
    result = result.skip(skip).limit(limit);

    // Invoke our Product.find function with the chained functions.
    const products = await result;

    // In the response to the client,
    // send the products we got back from
    // invoking the result function.
    res.status(200).json({ products, nbHits: products.length });
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}