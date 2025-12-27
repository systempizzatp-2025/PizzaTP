import Swal from "sweetalert2";

const successAlert = (title) => {
  const alert = Swal.fire({
    icon: "success",
    title: "Thêm sản phẩm thành công!",
    confirmButtonColor: "#00E5FF",
  });

  return alert;
};

export default successAlert;
