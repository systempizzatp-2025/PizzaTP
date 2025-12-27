
import React, { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import { useNavigate, useLocation } from "react-router-dom";

const Search = ({ darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSearchPage, setIsSearchPage] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const isSearch = location.pathname === "/tim-kiem";
    setIsSearchPage(isSearch);


    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q") || "";
    setSearchValue(query);
  }, [location]);

  const searchTerms = [
    "Pizza Hải Sản Việt",
    "Pizza Thập Cẩm",
    "Pizza Bò BBQ",
    "Pizza Gà Xông Khói",
    "Pizza Phô Mai",
    "Pizza Chay Việt",
    "Pizza Hải Sản Tôm Mực",
    "Combo Gia Đình",
    "Pizza Siêu To Khổng Lồ",
    "Pizza Gà Teriyaki",
    "Pizza Sốt Cà Chua Tươi",
    "Đặt Pizza Nóng Hổi",
    "Pizza Mực Xông Khói",
  ];

  const redirectToSearchPage = () => {
    navigate("/tim-kiem");
  };

  const handleOnChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);


    if (isSearchPage) {
      const url = value.trim()
        ? `/tim-kiem?q=${encodeURIComponent(value)}`
        : "/tim-kiem";
      navigate(url, { replace: true });
    }
  };

  const handleSearchSubmit = () => {
    if (searchValue.trim()) {
      navigate(`/tim-kiem?q=${encodeURIComponent(searchValue)}`);
    } else {
      navigate("/tim-kiem");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  return (
    <>

      {!isSearchPage ? (
        <div
          onClick={redirectToSearchPage}
          className="hidden lg:flex items-center border border-gray-300 dark:border-gray-600 rounded-md px-2 py-2 w-56 focus-within:ring-2 focus-within:ring-red-500 cursor-pointer transition-colors duration-200 bg-white dark:bg-gray-800 hover:border-red-500 group"
        >
          <TypeAnimation
            sequence={searchTerms.flatMap((term) => [term, 2000])}
            speed={50}
            repeat={Infinity}
            style={{
              display: "inline-block",
              color: darkMode ? "#f9fafb" : "#111827",
              width: "100%",
              pointerEvents: "none",
            }}
          />
          <SearchIcon
            size={20}
            className="ml-2 text-gray-500 group-hover:text-red-500 transition-colors"
          />
        </div>
      ) : (

        <div className="hidden lg:flex items-center border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-56 focus-within:ring-2 focus-within:ring-red-500 transition-colors duration-200 bg-white dark:bg-gray-800">
          <input
            type="text"
            value={searchValue}
            onChange={handleOnChange}
            onKeyPress={handleKeyPress}
            placeholder="Tìm kiếm..."
            className="w-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-500"
          />
          <SearchIcon
            size={20}
            className="ml-2 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
            onClick={handleSearchSubmit}
          />
        </div>
      )}

   
      {!isSearchPage ? (
        <button
          onClick={redirectToSearchPage}
          className="lg:hidden p-2 hover:text-red-500 transition-colors"
        >
          <SearchIcon size={20} />
        </button>
      ) : (

        <div className="lg:hidden flex items-center border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 w-40 focus-within:ring-2 focus-within:ring-red-500 transition-colors duration-200 bg-white dark:bg-gray-800">
          <input
            type="text"
            value={searchValue}
            onChange={handleOnChange}
            onKeyPress={handleKeyPress}
            placeholder="Tìm kiếm..."
            className="w-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-500 text-sm"
          />
          <SearchIcon
            size={18}
            className="ml-2 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
            onClick={handleSearchSubmit}
          />
        </div>
      )}
    </>
  );
};

export default Search;
