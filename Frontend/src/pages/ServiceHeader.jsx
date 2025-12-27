import React, { useState } from "react";

const ServiceHeader = () => {
  const [activeService, setActiveService] = useState("delivery");

  const services = [
    {
      id: "delivery",
      title: "Giao Hàng Tận Nơi",
      description: "Pizza nóng hổi giao tận nhà trong 30-45 phút",
      features: [
        "Miễn phí giao hàng đơn từ 300K",
        "Đóng hộp giữ nhiệt",
        "Theo dõi đơn hàng online",
      ],
      image:
        "https://plus.unsplash.com/premium_photo-1682146662576-900a71864a11?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZGVsaXZlcnl8ZW58MHx8MHx8fDA%3D",
    },
    {
      id: "takeaway",
      title: "Mang Về",
      description: "Đặt trước và đến lấy, tiết kiệm thời gian",
      features: [
        "Giảm 10% khi mang về",
        "Chuẩn bị sẵn khi bạn đến",
        "Không phải chờ đợi",
      ],
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=250&fit=crop",
    },
    {
      id: "dinein",
      title: "Tại Chỗ",
      description: "Trải nghiệm không gian thoải mái tại cửa hàng",
      features: [
        "Không gian sang trọng",
        "Combo ưu đãi đặc biệt",
        "Phục vụ tận tình",
      ],
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=250&fit=crop",
    },
  ];

  const paymentMethods = [
    {
      id: "stripe",
      name: "Thanh toán Online",
      description: "An toàn qua thẻ tín dụng/ghi nợ",
      features: ["Bảo mật tuyệt đối", "Xử lý ngay lập tức", "Visa, Mastercard"],
    },
    {
      id: "cod",
      name: "COD",
      description: "Thanh toán khi nhận hàng",
      features: ["Tiền mặt khi nhận hàng", "Kiểm tra hàng trước", "Tiện lợi"],
    },
  ];

  const currentService = services.find(
    (service) => service.id === activeService
  );

  return (
    <div className="min-h-70vh bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">

        <div className="flex justify-center gap-2 mb-8">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveService(service.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeService === service.id
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-white text-gray-700 shadow-sm hover:bg-gray-50"
              }`}
            >
              {service.title}
            </button>
          ))}
        </div>


        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="grid md:grid-cols-2 gap-6 p-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">
                {currentService.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                {currentService.description}
              </p>

              <div className="space-y-2 mb-6">
                {currentService.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center text-sm text-gray-700"
                  >
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                    {feature}
                  </div>
                ))}
              </div>

              {/* <div className="flex gap-3">
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                  Đặt Ngay
                </button>
                <button className="border border-orange-600 text-orange-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors">
                  Thực Đơn
                </button>
              </div> */}
            </div>

            <div className="flex items-center justify-center">
              <img
                src={currentService.image}
                alt={currentService.title}
                className="w-full h-48 object-cover rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>


        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2">
            Phương Thức Thanh Toán
          </h2>
          <p className="text-gray-600 text-sm">Lựa chọn an toàn và phù hợp</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
            >
              <h3 className="font-semibold text-gray-800 mb-1">
                {method.name}
              </h3>
              <p className="text-gray-600 text-xs mb-3">{method.description}</p>

              <div className="space-y-1 mb-4">
                {method.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center text-xs text-gray-700"
                  >
                    <span className="text-green-500 mr-1">•</span>
                    {feature}
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                  method.id === "stripe"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                Chọn {method.name}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <h3 className="font-semibold text-gray-800 mb-4">
            Thông Tin Liên Hệ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <div className="font-medium text-gray-700">Thời Gian</div>
              <p>08:00 - 22:00</p>
            </div>
            <div>
              <div className="font-medium text-gray-700">Hotline</div>
              <p>0973112480</p>
            </div>
            <div>
              <div className="font-medium text-gray-700">Địa Chỉ</div>
              <p className="text-xs">331 Đỗ Mười, Phường An Phú Đông, TP.HCM</p>
            </div>
          </div>
        </div>

    
        <div className="text-center mt-8">
          <button className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-sm">
            Đặt Hàng Ngay - 1900 1234
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceHeader;
