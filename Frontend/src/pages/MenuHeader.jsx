import React, { useState } from "react";

const MenuHeader = () => {
  const [activeCategory, setActiveCategory] = useState("Pizza");
  const [activeSubCategory, setActiveSubCategory] = useState("Pizza Hải Sản");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const menuData = {
    Pizza: {
      "Pizza Hải Sản": [
        { id: 1, name: "Pizza Hải Sản Cocktail", price: 159000 },
        { id: 2, name: "Pizza Hải Sản Cao Cấp", price: 189000 },
        { id: 3, name: "Pizza Hải Sản Nhiệt Đới", price: 169000 },
        { id: 4, name: "Pizza Tôm Cocktail", price: 149000 },
      ],
      "Pizza Thịt": [
        { id: 5, name: "Pizza Thịt Nguội Xúc Xích", price: 139000 },
        { id: 6, name: "Pizza Thịt Xông Khói Đặc Biệt", price: 149000 },
        { id: 7, name: "Pizza Thịt Nguội Kiểu Canada", price: 159000 },
        { id: 8, name: "Pizza Gà Nướng 3 Vị", price: 169000 },
        { id: 9, name: "Pizza 5 Loại Thịt Đặc Biệt", price: 179000 },
      ],
      "Pizza Đặc Biệt": [
        { id: 10, name: "Pizza Gà Nướng Dứa", price: 149000 },
        { id: 11, name: "Pizza Xúc Xích Ý", price: 139000 },
        { id: 12, name: "Pizza Thịt Nguội & Nấm", price: 159000 },
        { id: 13, name: "Pizza Hawaiian", price: 149000 },
      ],
      "Pizza Truyền Thống / Khác": [
        { id: 14, name: "Pizza Phô mai", price: 129000 },
        { id: 15, name: "Pizza Rau Củ", price: 119000 },
      ],
    },
    "Gà Nướng": {
      "Gà Nướng BBQ": [
        { id: 16, name: "Gà Nướng BBQ Vắt Chanh (2 miếng)", price: 79000 },
        { id: 17, name: "Gà Nướng BBQ Vắt Chanh (5 miếng)", price: 159000 },
        { id: 18, name: "Gà Nướng BBQ Vắt Chanh (9 miếng)", price: 259000 },
        { id: 19, name: "Gà Nướng BBQ Vắt Chanh (10 miếng)", price: 289000 },
      ],
      "Cánh Gà Nướng": [
        { id: 20, name: "Cánh Gà Nướng BBQ (6 miếng)", price: 119000 },
      ],
      "Khay Gà Nướng Tổng Hợp": [
        { id: 21, name: "Khai Vị Tổng Hợp (Cánh Gà Nướng BBQ)", price: 189000 },
      ],
    },
    "Gà Giòn": {
      "Gà Giòn Xốt Truyền Thống": [
        { id: 22, name: "Gà Giòn Xốt Truyền Thống (2 miếng)", price: 69000 },
        { id: 23, name: "Gà Giòn Xốt Truyền Thống (5 miếng)", price: 139000 },
        { id: 24, name: "Gà Giòn Xốt Truyền Thống (9 miếng)", price: 229000 },
      ],
      "Gà Giòn Xốt Tương Tỏi": [
        { id: 25, name: "Gà Giòn Xốt Tương Tỏi (2 miếng)", price: 69000 },
        { id: 26, name: "Gà Giòn Xốt Tương Tỏi (5 miếng)", price: 139000 },
        { id: 27, name: "Gà Giòn Xốt Tương Tỏi (9 miếng)", price: 229000 },
      ],
      "Gà Giòn Xốt Cay": [
        { id: 28, name: "Gà Giòn Xốt Cay (2 miếng)", price: 69000 },
        { id: 29, name: "Gà Giòn Xốt Cay (5 miếng)", price: 139000 },
        { id: 30, name: "Gà Giòn Xốt Cay (9 miếng)", price: 229000 },
      ],
      "Gà Giòn Xốt Kem Hành": [
        { id: 31, name: "Gà Giòn Xốt Kem Hành (2 miếng)", price: 69000 },
        { id: 32, name: "Gà Giòn Xốt Kem Hành (5 miếng)", price: 139000 },
        { id: 33, name: "Gà Giòn Xốt Kem Hành (9 miếng)", price: 229000 },
      ],
      "Da Gà Giòn": [
        { id: 34, name: "Da Gà Giòn", price: 49000 },
        { id: 35, name: "Da Gà Giòn Phủ Xốt Tương Tỏi", price: 59000 },
        { id: 36, name: "Da Gà Giòn Phủ Xốt Cay", price: 59000 },
      ],
      "Khay Gà Giòn Tổng Hợp": [
        { id: 37, name: "Khay Gà Tổng Hợp - Xốt Truyền Thống", price: 299000 },
        { id: 38, name: "Khay Gà Tổng Hợp - Xốt Tương Tỏi", price: 299000 },
        { id: 39, name: "Khay Gà Tổng Hợp - Xốt Cay", price: 299000 },
      ],
    },
    "Nui Bỏ Lò": {
      "Nui Bỏ Lò Phô Mai Hải Sản": [
        {
          id: 40,
          name: "Nui Bỏ Lò Phô Mai Hải Sản Xốt Hương Nhu",
          price: 129000,
        },
      ],
      "Nui Bỏ Lò Phô Mai Gà Nướng": [
        {
          id: 41,
          name: "Nui Bỏ Lò Phô Mai Gà Nướng BBQ Xốt Hương Nhu",
          price: 119000,
        },
      ],
      "Nui Bỏ Lò Phô Mai Thịt Nguội": [
        {
          id: 42,
          name: "Nui Bỏ Lò Phô Mai Thịt Nguội & Nấm Xốt Kem",
          price: 109000,
        },
      ],
      "Nui Bỏ Lò Phô Mai Gà Bơ Tỏi": [
        { id: 43, name: "Nui Bỏ Lò Phô Mai Gà Bơ Tỏi Xốt Kem", price: 119000 },
      ],
      "Nui Bỏ Lò Phô Mai Rau Củ": [
        { id: 44, name: "Nui Bỏ Lò Phô Mai Rau Củ Xốt Kem", price: 99000 },
      ],
    },
    "Mỳ Ý": {
      "Mỳ Ý Hải Sản": [
        { id: 45, name: "Mỳ Ý Ngêu Xốt Cay", price: 139000 },
        { id: 46, name: "Mỳ Ý Cay Hải Sản", price: 149000 },
      ],
      "Mỳ Ý Xốt Cà / Marinara": [
        { id: 47, name: "Mỳ Ý Chay Xốt Marinara", price: 89000 },
      ],
      "Mỳ Ý Xốt Kem": [
        { id: 48, name: "Mỳ Ý Tôm Xốt Kem Và Cà Chua", price: 139000 },
        { id: 49, name: "Mỳ Ý Giăm Bông Và Nấm Với Xốt Kem", price: 119000 },
        { id: 50, name: "Mỳ Ý Chay Xốt Kem Tươi", price: 99000 },
      ],
      "Mỳ Ý Pesto": [
        { id: 51, name: "Mỳ Ý Xốt Húng Quế", price: 109000 },
        { id: 52, name: "Mỳ Ý Pesto", price: 119000 },
      ],
      "Mỳ Ý Xúc Xích": [
        { id: 53, name: "Mỳ Ý Cay Với Xúc Xích", price: 129000 },
      ],
      "Mỳ Ý Bò Bằm": [{ id: 54, name: "Mỳ Ý Xốt Bò Bằm", price: 139000 }],
    },
    "Khai Vị": {
      "Khai Vị Chiên": [
        { id: 55, name: "Mực Chiên Giòn", price: 119000 },
        { id: 56, name: "Gà Popcorn", price: 69000 },
        { id: 57, name: "Gà Giòn Không Xương", price: 79000 },
      ],
      "Khai Vị Nướng": [
        { id: 58, name: "Bánh Phô Mai Xoắn", price: 89000 },
        { id: 59, name: "Tôm Bơ Tỏi Và Bánh Mì Nướng", price: 139000 },
      ],
      "Khoai Tây Chiên": [
        { id: 60, name: "Khoai Tây Chiên", price: 49000 },
        { id: 61, name: "Giỏ Khoai Tây Chiên", price: 79000 },
      ],
      "Bánh Mì / Garlic Bread": [
        { id: 62, name: "Bánh Mì Bơ Tỏi", price: 39000 },
        { id: 63, name: "Bánh Mì Bơ Tỏi Phủ Phô Mai", price: 59000 },
        { id: 64, name: "Bánh Mì Que Nướng", price: 49000 },
      ],
      "Mexico / Các món Mexico": [
        { id: 65, name: "Bánh Kẹp Nướng Mexico", price: 89000 },
      ],
      "Khai Vị Tổng Hợp": [
        { id: 66, name: "Cánh Gà Tẩm Bột Chiên Giòn (6 miếng)", price: 119000 },
        {
          id: 67,
          name: "Cánh Gà Tẩm Bột Chiên Giòn (10 miếng)",
          price: 189000,
        },
        { id: 68, name: "Khay Sườn Nướng BBQ (Cỡ Vừa)", price: 199000 },
        { id: 69, name: "Khay Sườn Nướng BBQ (Cỡ Lớn)", price: 299000 },
      ],
    },
    Salad: {
      "Salad Rau": [
        { id: 70, name: "Salad Trộn Dầu Giấm", price: 69000 },
        { id: 71, name: "Salad Đặc Sắc", price: 79000 },
      ],
      "Salad Gà": [
        { id: 72, name: "Salad Gà Giòn Không Xương", price: 89000 },
        { id: 73, name: "Salad Xốt Caesar", price: 79000 },
      ],
      "Salad Hải Sản": [
        { id: 74, name: "Salad Da Cá Hồi Giòn", price: 119000 },
      ],
    },
    "Đồ Uống": {
      "Nước Ngọt": [
        { id: 75, name: "Pepsi Lon", price: 19000 },
        { id: 76, name: "Pepsi 1.5L", price: 29000 },
        { id: 77, name: "7Up Lon", price: 19000 },
        { id: 78, name: "7Up 1.5L", price: 29000 },
        { id: 79, name: "Mirinda Soda Kem Lon", price: 19000 },
        { id: 80, name: "Coca", price: 19000 },
        { id: 81, name: "Sprite", price: 19000 },
      ],
      "Nước Không Đường": [
        { id: 82, name: "Pepsi Không Đường", price: 19000 },
        { id: 83, name: "Pepsi Không Đường Vị Chanh", price: 19000 },
        { id: 84, name: "Coca Light", price: 19000 },
      ],
      "Nước Khoáng": [
        { id: 85, name: "Aquafina", price: 15000 },
        { id: 86, name: "Nước Khoáng Alba", price: 25000 },
      ],
      "Nước Có Gas": [
        { id: 87, name: "Soda Water", price: 19000 },
        { id: 88, name: "Tonic Water", price: 19000 },
        { id: 89, name: "Dry Ginger Ale", price: 19000 },
      ],
      "Nước Trái Cây": [{ id: 90, name: "Red Bull", price: 29000 }],
    },
    Bia: {
      "Bia Lon": [
        { id: 91, name: "Bia Heineken", price: 35000 },
        { id: 92, name: "Bia 333", price: 25000 },
      ],
      "Bia Ngoại / Craft Beer": [
        { id: 93, name: "Magners Dâu Rừng", price: 69000 },
        { id: 94, name: "Magners Táo Original (Ireland)", price: 69000 },
        { id: 95, name: "Tê Tê White Ale", price: 59000 },
        { id: 96, name: "Heart Of Darkness Loose Rivet IPA", price: 79000 },
      ],
    },
    Kem: {
      Kem: [
        { id: 97, name: "Kem Socola", price: 39000 },
        { id: 98, name: "Kem Vani", price: 39000 },
        { id: 99, name: "Kem Dâu", price: 39000 },
      ],
    },
    "Gia Vị / Sốt": {
      "Sốt chấm": [
        { id: 100, name: "Sốt Garlic Mayo", price: 15000 },
        { id: 101, name: "Sốt Ranch", price: 15000 },
        { id: 102, name: "Sốt Spicy Mayo", price: 15000 },
      ],
      "Gia vị rắc": [
        { id: 103, name: "Ớt Mảnh Khô", price: 5000 },
        { id: 104, name: "Parmesan", price: 15000 },
      ],
      "Dầu ớt / Mật ong": [
        { id: 105, name: "Mật Ong", price: 10000 },
        { id: 106, name: "Dầu Ớt", price: 10000 },
      ],
    },
    "Bánh Ngọt": {
      "Bánh Brownie": [
        { id: 107, name: "Chocolate Brownie", price: 49000 },
        { id: 108, name: "Gluten Free Brownie", price: 59000 },
      ],
      "Bánh Cheesecake": [
        { id: 109, name: "New York Cheesecake Slice", price: 69000 },
      ],
    },
    Combo: {
      Combo: [
        { id: 110, name: "Khay Gà Tổng Hợp (Truyền Thống)", price: 299000 },
        { id: 111, name: "Khay Gà Tổng Hợp (Tương Tỏi)", price: 299000 },
        { id: 112, name: "Khay Gà Tổng Hợp (Cay)", price: 299000 },
      ],
    },
  };

  const categories = Object.keys(menuData);
  const subCategories = menuData[activeCategory]
    ? Object.keys(menuData[activeCategory])
    : [];
  const products = menuData[activeCategory]?.[activeSubCategory] || [];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  // const handleAddToCart = (product) => {
  //   const item = {
  //     ...product,
  //     quantity: quantity,
  //   };
  //   // Xử lý thêm vào giỏ hàng ở đây
  //   console.log("Added to cart:", item);
  //   setSelectedProduct(null);
  //   setQuantity(1);
  // };

  return (
    <div className="min-h-70vh bg-gray-50 pt-20">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto space-x-2 py-3 hide-scrollbar">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setActiveSubCategory(Object.keys(menuData[category])[0]);
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === category
                    ? "bg-orange-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>


      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {subCategories.map((subCategory) => (
              <button
                key={subCategory}
                onClick={() => setActiveSubCategory(subCategory)}
                className={`px-3 py-2 rounded-lg text-xs text-center transition-all ${
                  activeSubCategory === subCategory
                    ? "bg-orange-100 text-orange-700 border-2 border-orange-500 font-semibold"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-orange-300"
                }`}
              >
                {subCategory}
              </button>
            ))}
          </div>
        </div>
      </div>

  
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-orange-500 font-bold text-lg">
                    {formatPrice(product.price)}
                  </span>
                  {/* <button className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm hover:bg-orange-600 transition-colors">
                    Chọn
                  </button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      {/* {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {selectedProduct.name}
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-orange-500">
                  {formatPrice(selectedProduct.price)}
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Số lượng:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
                <button
                  onClick={() => handleAddToCart(selectedProduct)}
                  className="flex-1 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default MenuHeader;
