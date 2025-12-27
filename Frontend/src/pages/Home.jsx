import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import valideURLConvert from "../utils/valideURLConvert";
import Banner1 from "../assets/BannerPizzaTP/banner_pizzatp_1.jpg";
import Banner2 from "../assets/BannerPizzaTP/banner_pizzatp_2.jpg";
import Banner3 from "../assets/BannerPizzaTP/banner_pizzatp_3.jpg";
import { useSelector } from "react-redux";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef(null);
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();

  const bannerSlides = [
    {
      title: "Pizza Nóng Giòn Giao Nhanh",
      subtitle: "Đặt Ngay",
      image: Banner1,
      link: "/Pizza--692b1bcdfc26cd1cea2fa2ec/Pizza-Rau-Củ---Chay-692bca946e64047a444fbf9a",
    },
    {
      title: "Hương Vị Ý Đích Thực",
      subtitle: "Đặt Ngay",
      image: Banner2,
      link: "/Pizza--692b1bcdfc26cd1cea2fa2ec/Pizza-Rau-Củ---Chay-692bca946e64047a444fbf9a",
    },
    {
      title: "Pizza Từng Miếng Hoàn Hảo",
      subtitle: "Đặt Ngay",
      image: Banner3,
      link: "/Pizza--692b1bcdfc26cd1cea2fa2ec/Pizza-Rau-Củ---Chay-692bca946e64047a444fbf9a",
    },
  ];

  const handleRedirectProductListPage = (id, cat) => {
    const subcategory = subCategoryData.find((sub) =>
      sub.category.some((c) => c._id == id)
    );
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(
      subcategory.name
    )}-${subcategory._id}`;
    navigate(url);
  };


  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const moved = useRef(false);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    moved.current = false;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollStart.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.cursor = "grabbing";
    scrollRef.current.style.userSelect = "none";
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;

    if (Math.abs(walk) > 0) {
      moved.current = true;
    }

    scrollRef.current.scrollLeft = scrollStart.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    scrollRef.current.style.cursor = "grab";
    scrollRef.current.style.userSelect = "auto";
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      handleMouseUp();
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -250, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });
    }
  };

  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftIndicator(scrollLeft > 10);
    setShowRightIndicator(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const slider = scrollRef.current;
    if (slider) {
      slider.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (slider) {
        slider.removeEventListener("scroll", handleScroll);
      }
    };
  }, [categoryData]);

  return (
    <>

      <section
        id="billboard"
        className="relative bg-white pt-24 overflow-hidden border border-gray-100"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0 md:ml-20 order-2 md:order-1">
              <h1
                key={`title-${currentSlide}`}
                className="hidden md:block text-4xl md:text-6xl font-bold uppercase mb-8 animate-fade-in-up text-gray-900"
              >
                {bannerSlides[currentSlide].title}
              </h1>
              <Link
                to={bannerSlides[currentSlide].link}
                className="inline-block bg-red-600 text-white px-8 py-3 uppercase tracking-wider hover:bg-red-700 transition-all rounded-full animate-fade-in-up animation-delay-200 text-center w-full md:w-auto font-medium"
              >
                {bannerSlides[currentSlide].subtitle}
              </Link>
            </div>
            <div className="w-full md:w-1/2 relative order-1 md:order-2 mb-6 md:mb-0">
              <img
                key={`image-${currentSlide}`}
                src={bannerSlides[currentSlide].image}
                alt="Pizza"
                className="w-full h-64 md:h-96 max-w-md mx-auto object-contain drop-shadow-lg animate-zoom-in"
              />
            </div>
          </div>
        </div>
        <button
          onClick={() =>
            setCurrentSlide(currentSlide === 0 ? 2 : currentSlide - 1)
          }
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 hover:text-red-600 transition-all bg-white rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl z-10 border border-gray-200"
        >
          <ChevronLeft className="w-6 h-6 md:w-10 md:h-10" />
        </button>
        <button
          onClick={() =>
            setCurrentSlide(currentSlide === 2 ? 0 : currentSlide + 1)
          }
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 hover:text-red-600 transition-all bg-white rounded-full p-2 md:p-3 shadow-lg hover:shadow-xl z-10 border border-gray-200"
        >
          <ChevronRight className="w-6 h-6 md:w-10 md:h-10" />
        </button>
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? "bg-red-600 md:w-8"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        <style>{`
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes zoomIn { from { opacity: 0; transform: scale(0.8) rotate(-5deg); } to { opacity: 1; transform: scale(1) rotate(0deg); } }
          .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
          .animate-zoom-in { animation: zoomIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
          .animation-delay-200 { animation-delay: 0.2s; opacity: 0; }
        `}</style>
      </section>


      <section className="bg-white py-8 md:py-10">
        <h2 className="text-2xl font-bold mb-6 text-center">Danh Mục</h2>
        <div className="container mx-auto px-4 md:px-6">
    
          <div className="relative">
      
            <button
              onClick={scrollLeft}
              className={`absolute left-0 top-16 -translate-y-1/2 p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors z-20 ${
                !showLeftIndicator ? "opacity-30 cursor-not-allowed" : ""
              }`}
              disabled={!showLeftIndicator}
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>

      
            <button
              onClick={scrollRight}
              className={`absolute right-0 top-16 -translate-y-1/2 p-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors z-20 ${
                !showRightIndicator ? "opacity-30 cursor-not-allowed" : ""
              }`}
              disabled={!showRightIndicator}
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>

    
            {showLeftIndicator && (
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
            )}

            {showRightIndicator && (
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
            )}

            <div
              ref={scrollRef}
              className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
            >
              <div className="flex space-x-4 md:space-x-5 px-2 md:px-3 py-2 min-w-max">
                {loadingCategory
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 w-24 md:w-28 animate-pulse"
                      >
                        <div className="w-full aspect-square rounded-lg bg-gray-100 mb-2"></div>
                        <div className="w-20 h-3 bg-gray-100 rounded mx-auto"></div>
                      </div>
                    ))
                  : categoryData.map((cat, i) => (
                      <div
                        key={cat.id || i}
                        className="flex-shrink-0 w-24 md:w-28 cursor-pointer group"
                        onClick={(e) => {
                          if (!moved.current) {
                            handleRedirectProductListPage(cat._id, cat.name);
                          }
                          moved.current = false;
                        }}
                      >
                    
                        <div className="w-full aspect-square rounded-lg overflow-hidden mb-2 bg-white border border-gray-200">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover p-2"
                          />
                        </div>

                     
                        <h3 className="text-center font-medium text-gray-800 text-xs md:text-sm line-clamp-2 px-0.5 h-8">
                          {cat.name}
                        </h3>
                      </div>
                    ))}
              </div>
            </div>

         
            <div className="flex justify-center gap-1 mt-4 md:hidden">
              {Array.from({
                length: Math.min(4, Math.ceil(categoryData.length / 4)),
              }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      </section>

 
      {categoryData.map((c) => (
        <CategoryWiseProductDisplay
          key={c?._id + "CategorywiseProduct"}
          id={c?._id}
          name={c?.name}
          handleRedirect={() => handleRedirectProductListPage(c?._id, c?.name)}
        />
      ))}
    </>
  );
};

export default Home;
