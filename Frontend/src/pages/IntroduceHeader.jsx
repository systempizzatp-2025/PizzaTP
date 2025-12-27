import React from "react";
import avt1 from "../assets/avt_gioithieu_bht.jpg";
import avt2 from "../assets/avt_gioithieu_nhdp.png";

const IntroduceHeader = () => {
  const founders = [
    {
      name: "Bùi Hải Trọng",
      role: "Co-Founder & CEO",
      description:
        "Chuyên gia về quản lý chuỗi cửa hàng và phát triển kinh doanh. Với 5 năm kinh nghiệm trong ngành F&B, Trọng mang đến tầm nhìn chiến lược và định hướng phát triển cho PizzaTP.",
      image: avt1,
    },
    {
      name: "Nguyễn Hoàng Duy Phong",
      role: "Co-Founder & CTO",
      description:
        "Chuyên gia công nghệ và digital transformation. Phong phụ trách phát triển hệ thống đặt hàng online, công nghệ bếp và trải nghiệm khách hàng số.",
      image: avt2,
    },
  ];

  const milestones = [
    { year: "2023", event: "Thành lập PizzaTP với 1 cửa hàng đầu tiên" },
    { year: "2024", event: "Mở rộng 3 chi nhánh tại TP.HCM" },
    { year: "2024", event: "Ra mắt ứng dụng đặt hàng online" },
    { year: "2025", event: "Kế hoạch mở rộng ra toàn quốc" },
  ];

  const values = [
    {
      title: "Chất Lượng",
      description: "Nguyên liệu tươi ngon, công thức chuẩn Ý",
    },
    {
      title: "Sáng Tạo",
      description: "Liên tục đổi mới menu và dịch vụ",
    },
    {
      title: "Khách Hàng",
      description: "Trải nghiệm ưu tiên hàng đầu",
    },
    {
      title: "Công Nghệ",
      description: "Ứng dụng công nghệ để phục vụ tốt hơn",
    },
  ];

  return (
    <div className="min-h-70vh bg-gray-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
 
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Câu Chuyện Của Chúng Tôi
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              PizzaTP được thành lập vào năm 2023 bởi hai người bạn{" "}
              <strong>Bùi Hải Trọng</strong> và{" "}
              <strong>Nguyễn Hoàng Duy Phong</strong> với mong muốn mang đến
              trải nghiệm ẩm thực Ý chân thực nhất kết hợp với công nghệ hiện
              đại.
            </p>
            <p className="mb-4">
              Từ một cửa hàng nhỏ tại TP.HCM, chúng tôi đã phát triển thành
              chuỗi cửa hàng pizza được yêu thích nhờ chất lượng ổn định, dịch
              vụ chuyên nghiệp và hệ thống đặt hàng thông minh.
            </p>
            <p>
              Với phương châm "Pizza ngon - Dịch vụ tốt - Công nghệ thông minh",
              PizzaTP không ngừng đổi mới để mang đến trải nghiệm tốt nhất cho
              khách hàng.
            </p>
          </div>
        </div>

   
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Đội Ngũ Sáng Lập
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {founders.map((founder, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center"
              >
                <div className="w-32 h-32 mx-auto mb-4">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover rounded-full border-4 border-orange-100"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {founder.name}
                </h3>
                <div className="text-orange-600 font-medium mb-4">
                  {founder.role}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {founder.description}
                </p>
              </div>
            ))}
          </div>
        </div>

  
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Sứ Mệnh</h3>
            <p className="text-gray-700">
              Mang đến những chiếc pizza chất lượng cao với hương vị chân thực,
              kết hợp công nghệ để tối ưu trải nghiệm đặt hàng và giao nhận cho
              khách hàng.
            </p>
          </div>
          <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Tầm Nhìn</h3>
            <p className="text-gray-700">
              Trở thành thương hiệu pizza được yêu thích nhất Việt Nam, tiên
              phong trong ứng dụng công nghệ vào ẩm thực và dịch vụ F&B.
            </p>
          </div>
        </div>


        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Giá Trị Cốt Lõi
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 text-center border border-gray-200"
              >
                <div className="text-orange-500 text-lg font-bold mb-2">
                  {value.title}
                </div>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>


        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Chặng Đường Phát Triển
          </h2>
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="bg-orange-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {milestone.year}
                </div>
                <div className="pt-2">
                  <p className="text-gray-800 font-medium">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        {/* <div className="text-center mt-12">
          <div className="bg-orange-600 rounded-xl p-8 text-white">
            <h3 className="text-xl font-bold mb-4">
              Bắt Đầu Hành Trình Pizza Cùng Chúng Tôi
            </h3>
            <p className="mb-6 text-orange-100">
              Đặt pizza ngay hoặc liên hệ để biết thêm thông tin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Đặt Hàng Ngay
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">
                Liên Hệ Chúng Tôi
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default IntroduceHeader;
