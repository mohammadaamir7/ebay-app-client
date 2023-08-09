const Item = require('../../models/Item');
const ScraperConfig = require('../../models/ScraperConfig');

exports.sendItems = async (req, res) => {
    const { page, limit } = req.query;

    try {
        const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

        const items = await Item.find({}).skip(offset).limit(parseInt(limit, 10));
        const total = await Item.countDocuments({});

        res.status(200).json({ items, total });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

exports.sendItemInfo = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ item });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.updateItemInfo = async (req, res) => {
    const { id } = req.params;

    try {
        const updatedItem = await Item.findByIdAndUpdate(id, req.body.updatedItem, { new: true, runValidators: true });

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ success: true, data: updatedItem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.sendSiteInfo = async (req, res) => {
    try {
        const configs = await ScraperConfig.find({});

        const sites = configs.map(obj => {
            return { site: obj.site, brands: obj.brands }
        });

        res.status(200).json({ sites })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

exports.sendSearchInfo = async (req, res) => {
    const { term, site, brand, page, limit } = req.query;

    let query = {
        $or: [
            { productName: { $regex: term, $options: 'i' } },
            { itemNumber: { $regex: term, $options: 'i' } },
        ],
    };

    if (site) query.site = site;
    if (brand) query.brand = brand;

    if (term.length < 1 && Object.keys(query).length === 1) {
        res.status(200).json({ items: [], term, total: 1 });
        return;
    }

    // const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    try {
        const items = await Item.find(query)// .skip(offset).limit(parseInt(limit, 10));
        // const total = await Item.countDocuments({});

        res.status(200).json({ items, term, total: 1 })
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
}

