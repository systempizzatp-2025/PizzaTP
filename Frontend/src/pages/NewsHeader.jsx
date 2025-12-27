import React, { useState } from "react";

const NewsHeader = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "promotions", name: "Khuyến mãi" },
    { id: "events", name: "Sự kiện" },
    { id: "recipes", name: "Công thức" },
    { id: "news", name: "Tin tức" },
  ];

  const newsArticles = [
    {
      id: 1,
      title: "PizzaTP Khai Trương Chi Nhánh Mới Tại Quận 2",
      excerpt:
        "Mở rộng hệ thống với không gian hiện đại, phục vụ thực khách khu vực phía Đông TP.HCM",
      category: "news",
      date: "15/12/2024",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop",
      readTime: "2 phút",
    },
    {
      id: 2,
      title: "Ưu Đãi Đặc Biệt - Mua 1 Tặng 1",
      excerpt:
        "Cơ hội thưởng thức pizza thả ga với chương trình mua 1 tặng 1 áp dụng tất cả các ngày trong tuần",
      category: "promotions",
      date: "10/12/2024",
      image:
        "https://plus.unsplash.com/premium_photo-1728613749980-cd3e758183df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3BlY2lhbCUyMG9mZmVyc3xlbnwwfHwwfHx8MA%3D%3D",
      readTime: "1 phút",
    },
    {
      id: 3,
      title: "Workspace Làm Pizza Cùng Đầu Bếp Chuyên Nghiệp",
      excerpt:
        "Trải nghiệm độc đáo: tự tay làm pizza dưới sự hướng dẫn của đầu bếp 5 năm kinh nghiệm",
      category: "events",
      date: "08/12/2024",
      image:
        "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=250&fit=crop",
      readTime: "3 phút",
    },
    {
      id: 4,
      title: "Bí Quyết Làm Pizza Tại Nhà Chuẩn Vị Ý",
      excerpt:
        "Chia sẻ công thức và kỹ thuật làm pizza ngon như nhà hàng ngay tại căn bếp của bạn",
      category: "recipes",
      date: "05/12/2024",
      image:
        "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=250&fit=crop",
      readTime: "5 phút",
    },
    {
      id: 5,
      title: "PizzaTP Đạt Chứng Nhận An Toàn Vệ Sinh Thực Phẩm",
      excerpt:
        "Cam kết mang đến những sản phẩm chất lượng nhất, đảm bảo sức khỏe cho thực khách",
      category: "news",
      date: "01/12/2024",
      image:
        "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=250&fit=crop",
      readTime: "2 phút",
    },
    {
      id: 6,
      title: "Combo Gia Đình - Tiết Kiệm Đến 40%",
      excerpt:
        "Combo ưu đãi đặc biệt dành cho gia đình với đầy đủ pizza, gà, đồ uống và tráng miệng",
      category: "promotions",
      date: "28/11/2024",
      image:
        "https://plus.unsplash.com/premium_photo-1664392184839-d339e16f17cc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29tYm8lMjBmYW1pbHklMjBmb29kfGVufDB8fDB8fHww",
      readTime: "1 phút",
    },
  ];

  const filteredArticles =
    activeCategory === "all"
      ? newsArticles
      : newsArticles.filter((article) => article.category === activeCategory);

  const getCategoryColor = (category) => {
    const colors = {
      promotions: "bg-red-100 text-red-600",
      events: "bg-blue-100 text-blue-600",
      recipes: "bg-green-100 text-green-600",
      news: "bg-gray-100 text-gray-600",
    };
    return colors[category] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-70vh bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === category.id
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-white text-gray-700 shadow-sm hover:bg-gray-50"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>


        {filteredArticles.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                    filteredArticles[0].category
                  )} mb-3`}
                >
                  {
                    categories.find(
                      (cat) => cat.id === filteredArticles[0].category
                    )?.name
                  }
                </span>
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  {filteredArticles[0].title}
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  {filteredArticles[0].excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{filteredArticles[0].date}</span>
                  <span>{filteredArticles[0].readTime} đọc</span>
                </div>
                <button className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                  Đọc Tiếp
                </button>
              </div>
              <div className="flex items-center justify-center p-4">
                <img
                  src={filteredArticles[0].image}
                  alt={filteredArticles[0].title}
                  className="w-full h-48 object-cover rounded-lg shadow-sm"
                />
              </div>
            </div>
          </div>
        )}

       
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.slice(1).map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(
                      article.category
                    )}`}
                  >
                    {
                      categories.find((cat) => cat.id === article.category)
                        ?.name
                    }
                  </span>
                  <span className="text-xs text-gray-500">
                    {article.readTime}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{article.date}</span>
                  <button className="text-orange-600 hover:text-orange-700 font-medium">
                    Đọc thêm →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

    
        <div className="bg-orange-600 rounded-xl p-6 mt-12 text-center text-white">
          <h3 className="font-bold text-lg mb-2">Đăng Ký Nhận Tin</h3>
          <p className="text-orange-100 text-sm mb-4">
            Nhận thông tin khuyến mãi và sự kiện mới nhất từ PizzaTP
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 px-4 py-2 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button className="bg-white text-orange-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors whitespace-nowrap">
              Đăng Ký Ngay
            </button>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-gray-600">
          <p>Hotline: 0973112480 | Email: system.pizzatp@gmail.com</p>
          <p className="mt-1">
            Theo dõi chúng tôi trên mạng xã hội để cập nhật tin tức mới nhất
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsHeader;
