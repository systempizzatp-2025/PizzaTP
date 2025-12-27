import React from "react";
import { IoClose } from "react-icons/io5";

const AddFieldComponent = ({ close, value, onChange, submit }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  return (
    <section className="fixed top-0 bottom-0 right-0 left-0 bg-neutral-900 bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded p-4 w-full max-w-md">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-semibold">Thêm trường dữ liệu</h1>
          <button onClick={close}>
            <IoClose size={25} />
          </button>
        </div>

        <input
          className="bg-blue-50 my-2 p-2 border outline-none focus-within:border-primary-100 rounded w-full"
          placeholder="Nhập tên trường dữ liệu"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
        />

        <button
          onClick={submit}
          className="bg-primary-100 hover:bg-primary-100 px-4 py-2 rounded mx-auto w-fit block"
        >
          Thêm
        </button>
      </div>
    </section>
  );
};

export default AddFieldComponent;
