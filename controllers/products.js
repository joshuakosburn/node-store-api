// CRUD
// GET
// POST
// PATCH - Remember Idempotency!
// DELETE
const getAllProductsStatic = async (req, res) => {
    res.status(200).json({ msg: 'Prodcuts testing route' });
}

const getAllProducts = async (req, res) => {
    res.status(200).json({ msg: 'Prodcuts route' });
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}