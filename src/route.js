import loadable from "~js/utils/loadable";

/**
 * @namespace routes
 */
export default {
  // 逻辑页
  "/": {
    component: loadable(() => import("~js/pages/Home.jsx"))
  },
  "/:type(login|register)": {
    layout: false,
    component: loadable(() => import("~js/pages/Login.jsx"))
  },
  "/shopinfo": {
    component: loadable(() => import("~js/pages/Shop/ShopInfo.jsx"))
  },
  "/staffmanage": {
    component: loadable(() => import("~js/pages/Shop/StaffManage.jsx"))
  },
  "/goodsmanage": {
    component: loadable(() => import("~js/pages/Goods/GoodsManage.jsx"))
  },
  "/goodscategories": {
    component: loadable(() => import("~js/pages/Goods/GoodsCategories.jsx"))
  },
  "/ordermanage": {
    component: loadable(() => import("~js/pages/Purchase/OrderManage.jsx"))
  },
  "/ordermanage/:id": {
    component: loadable(() => import("~js/pages/Purchase/OrderDetails.jsx"))
  },
  "/supplier": {
    component: loadable(() => import("~js/pages/Purchase/Supplier.jsx"))
  },
  "/ordertopay": {
    component: loadable(() => import("~js/pages/Purchase/OrderToPay.jsx"))
  },
  "/vipmanage": {
    component: loadable(() => import("~js/pages/Vip/VipManage.jsx"))
  },
  "/cashcenter": {
    component: loadable(() => import("~js/pages/Cash/CashCenter.jsx"))
  },
  // 错误页
  "/403": {
    layout: false,
    component: loadable(() => import("~js/pages/403.jsx"))
  },
  "/404": {
    layout: false,
    component: loadable(() => import("~js/pages/404.jsx"))
  },
  "/500": {
    layout: false,
    component: loadable(() => import("~js/pages/500.jsx"))
  }
};
