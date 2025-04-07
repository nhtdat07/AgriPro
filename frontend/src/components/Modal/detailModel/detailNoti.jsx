function DetailNoti({ data }) {
  return (
    <div className="mt-2 p-2 bg-green-50 rounded border text-sm">
      <p><span className="font-semibold">Tên sản phẩm:</span> {data.info1}</p>
      <p><span className="font-semibold">Số lượng:</span> {data.info2}</p>
      <p><span className="font-semibold">Hạn dùng:</span> {data.info3}</p>
    </div>
  );
}

export default DetailNoti;
