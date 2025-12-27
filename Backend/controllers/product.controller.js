import ProductModel from "../models/product.model.js";

export const createProductController = async (request, response) => {
  try {
    const {
      name,
      image,
      category,
      subCategory,
      price,
      discount,
      description,
      more_details,
      type,
      sizes,
      bases,
    } = request.body;

   

    if (
      !name ||
      !description ||
      !type ||
      !price ||
      price === undefined ||
      discount === undefined ||
      !image?.length ||
      !category?.length ||
      !subCategory?.length
    ) {
      return response.status(400).json({
        message:
          "Enter required fields (name, description, type, price, discount, image, category, subCategory)",
        error: true,
        success: false,
      });
    }


    const productData = {
      name,
      image,
      category,
      subCategory,
      price,
      discount,
      description,
      more_details: more_details || {},
      type,
    };


    if (sizes && Array.isArray(sizes) && sizes.length > 0) {
      productData.sizes = sizes;
    }

    if (bases && Array.isArray(bases) && bases.length > 0) {
      productData.bases = bases;
    }

    const product = new ProductModel(productData);

    await product.save();

    return response.status(201).json({
      message: "Product created successfully",
      error: false,
      success: true,
      data: product,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

export const getProductController = async (request, response) => {
  try {
    let { page, limit, search } = request.body;

    if (!page) {
      page = 2;
    }

    if (!limit) {
      limit = 10;
    }

    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};
    const skip = (page - 1) * limit;
    const [data, totalCount] = await Promise.all([
      ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ProductModel.countDocuments(query),
    ]);

    return response.json({
      message: "Product data",
      error: false,
      success: true,
      totalCount: totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data: data,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductByCategory = async (request, response) => {
  try {
    const { id } = request.body;

    if (!id) {
      return response.status(400).json({
        message: "Provide category id",
        error: true,
        success: false,
      });
    }

    const product = await ProductModel.find({
      category: { $in: id },
    }); // .limit(15);

    return response.json({
      message: "product category list",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductByCategoryAndSubcategory = async (request, response) => {
  try {
    let { categoryId, subCategoryId, page, limit } = request.body;

    if (!categoryId || !subCategoryId) {
      return response.status(400).json({
        message: "Provide catgory and subcategory id",
        error: true,
        success: false,
      });
    }

    page = page || 1;
    limit = limit || 10;


    if (!Array.isArray(categoryId)) categoryId = [categoryId];
    if (!Array.isArray(subCategoryId)) subCategoryId = [subCategoryId];

    const query = {
      category: { $in: categoryId },
      subCategory: { $in: subCategoryId },
    };

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category")
        .populate("subCategory")
        .lean(),
      ProductModel.countDocuments(query),
    ]);

    return response.json({
      message: "product list",
      data: data,
      totalCount: dataCount,
      page: page,
      limit: limit,
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductDetailsController = async (request, response) => {
  try {
    const { productId } = request.body;

    const product = await ProductModel.findOne({ _id: productId });

    return response.json({
      message: "Product details fetch success",
      error: false,
      success: true,
      data: product,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const updateProductDetailesController = async (request, response) => {
  try {
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "provide product _id",
        error: true,
        success: false,
      });
    }

    const updateProduct = await ProductModel.updateOne(
      { _id: _id },
      {
        ...request.body,
      }
    );

    return response.json({
      message: "Product update success",
      error: false,
      success: true,
      data: updateProduct,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const deleteProductDetailsController = async (request, response) => {
  try {
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "provide _id",
        error: true,
        success: false,
      });
    }

    const deleteProduct = await ProductModel.deleteOne({ _id: _id });

    return response.json({
      message: "Product delete success",
      success: true,
      error: false,
      data: deleteProduct,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const searchProduct = async (request, response) => {
  try {
    let { search, page, limit } = request.body;

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};

    const skip = (page - 1) * limit;
    const [data, dataCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      ProductModel.countDocuments(query),
    ]);

    return response.json({
      message: "Product data",
      error: false,
      success: true,
      data: data,
      totalCount: dataCount,
      totalPage: Math.ceil(dataCount / limit),
      page: page,
      limit: limit,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const relatedProducts = async (request, response) => {
  try {
    const { productId, type } = request.body;

    if (!productId || !type) {
      return response.status(400).json({
        message: "productId and type are required",
        success: false,
        error: true,
      });
    }


    const product = await ProductModel.findById(productId);
    if (!product)
      return response.status(404).json({ message: "Product not found" });
    const products = await ProductModel.find({
      type: product.type,
      _id: { $ne: productId },
    }).limit(4);

    return response.json({
      data: products,
      message: "Related products fetched successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || "Server error",
      success: false,
      error: true,
    });
  }
};
