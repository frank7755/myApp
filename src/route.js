import loadable from '~js/utils/loadable';

/**
 * @namespace routes
 */
export default {
  // 逻辑页
  '/': {
    component: loadable(() => import('~js/pages/Home.jsx'))
  },
  '/:type(login|register)': {
    layout: false,
    component: loadable(() => import('~js/pages/Login.jsx'))
  },
  '/shopinfo': {
    component: loadable(() => import('~js/pages/Shop/ShopInfo.jsx'))
  },
  '/staffmanage': {
    component: loadable(() => import('~js/pages/Shop/StaffManage.jsx'))
  },
  '/goodsadd': {
    component: loadable(() => import('~js/pages/Goods/GoodsAdd/Index.jsx'))
  },
  '/goodssearch': {
    component: loadable(() => import('~js/pages/Goods/GoodsSearch.jsx'))
  },
  '/goodscategories': {
    component: loadable(() => import('~js/pages/Goods/GoodsCategories.jsx'))
  },
  '/ordermanage': {
    component: loadable(() => import('~js/pages/Purchase/OrderManage.jsx'))
  },
  '/ordermanage/:id': {
    component: loadable(() => import('~js/pages/Purchase/OrderDetails.jsx'))
  },
  '/supplier': {
    component: loadable(() => import('~js/pages/Purchase/Supplier.jsx'))
  },
  '/ordertopay': {
    component: loadable(() => import('~js/pages/Purchase/OrderToPay.jsx'))
  },
  '/vipmanage': {
    component: loadable(() => import('~js/pages/Vip/VipManage.jsx'))
  },
  '/cashcenter': {
    component: loadable(() => import('~js/pages/Cash/CashCenter.jsx'))
  },
  '/sellsearch': {
    component: loadable(() => import('~js/pages/Cash/SellSearch.jsx'))
  },
  '/onlineorder': {
    component: loadable(() => import('~js/pages/Cash/OnlineOrder.jsx'))
  },
  '/onlineorder/:id': {
    component: loadable(() => import('~js/pages/Cash/OnlineOrderDetails.jsx'))
  },
  '/onlineorder/action/:id': {
    component: loadable(() => import('~js/pages/Cash/OrderAction.jsx'))
  },
  '/sourcecenter': {
    component: loadable(() => import('~js/pages/Upload/Index.jsx'))
  },
  '/propertydetails': {
    component: loadable(() => import('~js/pages/Property/PropertyDetails.jsx'))
  },
  '/withdrawrecord': {
    component: loadable(() => import('~js/pages/Property/WithdrawRecord.jsx'))
  },
  '/selldata': {
    component: loadable(() => import('~js/pages/Data/SellData.jsx'))
  },
  '/sellrank': {
    component: loadable(() => import('~js/pages/Data/SellRank.jsx'))
  },
  '/sellanalysis': {
    component: loadable(() => import('~js/pages/Data/SellAnalysis.jsx'))
  },
  '/singlegoods': {
    component: loadable(() => import('~js/pages/Data/SingleGoods.jsx'))
  },
  // 错误页
  '/403': {
    layout: false,
    component: loadable(() => import('~js/pages/403.jsx'))
  },
  '/404': {
    layout: false,
    component: loadable(() => import('~js/pages/404.jsx'))
  },
  '/500': {
    layout: false,
    component: loadable(() => import('~js/pages/500.jsx'))
  }
};
