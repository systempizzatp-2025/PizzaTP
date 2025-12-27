import { useState } from "react";

const CreateDeliveryBox = ({ close, onCreate }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    onCreate(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Tạo tài khoản nhân viên</h2>

        <div className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Tên nhân viên giao hàng"
            className="w-full px-2 py-2 border rounded-lg border-gray-300 
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
           transition-all"
            value={form.name}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full py-2 px-2 border rounded-lg border-gray-300 
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
           transition-all"
            value={form.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            className="w-full px-2 py-2 border rounded-lg border-gray-300 
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
           transition-all"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={close}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Tạo tài khoản
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDeliveryBox;
