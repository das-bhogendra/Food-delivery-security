export const API = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    WHOAMI: "/api/auth/whoami",
    UPDATEPROFILE: "/api/auth/update-profile",
  },

  ADMIN: {
    USER: {
      CREATE: "/api/admin/users",
      GET_ALL: "/api/admin/users",
      GET_BY_ID: "/api/admin/users/",
      UPDATE: "/api/admin/users/",
      DELETE: "/api/admin/users/",
    },

    FOOD: {
      CREATE: "/api/fooditems",
      GET_ALL: "/api/fooditems",
      GET_BY_ID: "/api/fooditems/",
      UPDATE: "/api/fooditems/",
      DELETE: "/api/fooditems/",
    },

    CATEGORY: {
      CREATE: "/api/categories",
      GET_ALL: "/api/categories",
      GET_BY_ID: "/api/categories/",
      UPDATE: "/api/categories/",
      DELETE: "/api/categories/",
    },

    ORDER: {
      GET_ALL: "/api/orders",
      GET_BY_ID: "/api/orders/",
      UPDATE: "/api/orders/",
      DELETE: "/api/orders/",
    },
  },

  USER: {
    FOOD: {
      GET_ALL: "/api/fooditems",
      GET_BY_TYPE: "/api/fooditems/type/",
      GET_BEST_SELLERS: "/api/fooditems/best-sellers",
      GET_DISCOUNTED: "/api/fooditems/discounted",
    },

    ORDER: {
      CREATE: "/api/orders",
      GET_USER_ORDERS: "/api/orders/user/",
      GET_BY_ID: "/api/orders/",
      UPDATE: "/api/orders/",
      DELETE: "/api/orders/",
    },

    CART: {
      // Add if backend supports cart
    },
  },
};