exports.queryhandler = (req, res, next) => {
  try {
    const { filters } = req.query;
    const { stores, suppliers, price, quantity, soldQuantity, searchTerm, brand } =
      JSON.parse(filters);
    const filtersObject = { ...JSON.parse(filters) };
    let whereClause = {};

    Object.keys(JSON.parse(filters)).map((key) => {
      if (
        filtersObject[key] === null ||
        filtersObject[key] === "" ||
        (Array.isArray(filtersObject[key]) && filtersObject[key].length == 0)
      ) {
        whereClause = whereClause;
      } else {
        if (key === "stores") {
          whereClause = { ...whereClause, store: { $in: stores } };
        } else if (key === "brand") {
          whereClause = { ...whereClause, brand };
        } else if (key === "suppliers") {
          whereClause = { ...whereClause, supplier: { $in: suppliers } };
        } else if (key === "price") {
          whereClause = {
            ...whereClause,
            price: { $gte: price?.min, $lte: price?.max },
          };
        } else if (key === "quantity") {
          whereClause = {
            ...whereClause,
            quantity: { $gte: quantity?.min, $lte: quantity?.max },
          };
        } else if (key === "soldQuantity") {
          whereClause = {
            ...whereClause,
            soldQuantity: {
              $gte: soldQuantity?.min,
              $lte: soldQuantity?.max,
            },
          };
        }
      }
    });

    if(searchTerm){
      whereClause = {
        ...whereClause,
        $or: [
          { itemId: { $regex: `${searchTerm}`, $options: "i" } },
          { supplier: { $regex: `${searchTerm}`, $options: "i" } },
          { store: { $regex: `${searchTerm}`, $options: "i" } },
          { title: { $regex: `${searchTerm}`, $options: "i" } },
          { brand: { $regex: `${searchTerm}`, $options: "i" } },
          { sku: { $regex: `${searchTerm}`, $options: "i" } }
        ],
      };
    }

    req.whereClause = whereClause;

    next();
  } catch (err) {
    console.log(err);
  }
};
