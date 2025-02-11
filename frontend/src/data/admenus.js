import {
  faHouseUser,
  faWarehouse,
  faCartShopping,
  faChartSimple,
  faGear
} from "@fortawesome/free-solid-svg-icons";

const initadMenu = [
  {
    label: "Trang chủ",
    path: "/homepage",
    icon: faHouseUser,
  },
  {
    label: 'Quản lý'
  },
  {
    label: "Quản lý kho & nhập hàng",
    path: "/inventoryPurchase",
    icon: faWarehouse,
  },
  {
    label: "Quản lý bán hàng",
    path: "/sales",
    icon: faCartShopping,
  },

  {
    label: 'Khác'
  },
  {
    label: "Thống kê & báo cáo",
    path: "/statisticReport",
    icon: faChartSimple,
  },
  {
    label: "Cài đặt",
    path: "/settings",
    icon: faGear
  },
];

export default initadMenu