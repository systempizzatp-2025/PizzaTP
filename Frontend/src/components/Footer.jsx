import React from "react";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import logo from "../assets/logo_tp.png";

const Footer = () => {
  return (
    <footer className="py-6 bg-white text-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-2xl font-bold flex items-center gap-2">
              <img src={logo} alt="Logo" className="inline w-12 h-12 mr-1" />
            </div>
            <p className="text-gray-900 mb-4">
              PizzaTP xin cam kết. Làm bằng tình yêu và nguyên liệu tươi.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Linkedin, Youtube].map(
                (Icon, i) => (
                  <Icon
                    key={i}
                    size={20}
                    className="cursor-pointer hover:text-red-500 transition-colors"
                  />
                )
              )}
            </div>
          </div>

          <div>
            <h5 className="font-semibold uppercase mb-4">Liên Kết</h5>
            <ul className="space-y-2 text-gray-900">
              <li>
                <a href="/" className="hover:text-red-500 transition-colors">
                  Trang Chủ
                </a>
              </li>
              <li>
                <a
                  href="/gioi-thieu"
                  className="hover:text-red-500 transition-colors"
                >
                  Về Chúng Tôi
                </a>
              </li>
              <li>
                <a
                  href="/thuc-don"
                  className="hover:text-red-500 transition-colors"
                >
                  Thực Đơn
                </a>
              </li>
              <li>
                <a
                  href="/tin-tuc"
                  className="hover:text-red-500 transition-colors"
                >
                  Tin Tức
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold uppercase mb-4">Hỗ Trợ</h5>
            <ul className="space-y-2 text-gray-900">
              {[
                "Theo Dõi Đơn Hàng",
                "Thông Tin Giao Hàng",
                "Chính Sách Đổi Trả",
                "Câu Hỏi Thường Gặp",
                "Thông Tin Dị Ứng",
              ].map((item, i) => (
                <li key={i}>
                  <div className="hover:text-red-500 transition-colors">
                    {item}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-semibold uppercase mb-4">Liên Hệ</h5>
            <p className="text-gray-900 mb-2">
              Câu hỏi?{" "}
              <div className="text-red-500 hover:underline">
                system.pizzatp@gmail.com
              </div>
            </p>
            <p className="text-gray-900 mb-4">
              Đặt hàng:{" "}
              <div className="text-red-500 hover:underline">0973112480</div>
            </p>
            <p className="text-gray-900 text-sm">
              331 Đỗ Mười, Phường An Phú Đông, TP.HCM
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-900 text-sm">
          <p>© 2025 PizzaTP. Bản quyền thuộc về chúng tôi</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
