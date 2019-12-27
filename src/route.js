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
  "/goodscategories": {
    component: loadable(() => import("~js/pages/Goods/GoodsCategories.jsx"))
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
