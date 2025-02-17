import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

const { VITE_APP_BASE_API_URL } = import.meta.env;

const baseQuery = fetchBaseQuery({
  baseUrl: VITE_APP_BASE_API_URL,
  prepareHeaders: headers => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args: string | FetchArgs,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);

  // Ensure error.data is treated as an object with an optional 'message' property
  const errorData = result.error?.data as { code?: string } | undefined;

  if (errorData && errorData.code === 'EXPIREDTOKEN') {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => {
    return {
      // Login
      login: builder.mutation({
        query: data => ({
          url: 'auth/login',
          method: 'POST',
          body: data,
        }),
      }),

      // Login with google
      loginWithGoogle: builder.mutation({
        query: data => ({
          url: 'auth/login/oath/google',
          method: 'POST',
          body: data,
        }),
      }),

      // Forgot Password
      forgotPassword: builder.mutation({
        query: data => ({
          url: 'auth/forgot-password',
          method: 'POST',
          body: data,
        }),
      }),

      // Reset Password
      resetPassword: builder.mutation({
        query: ({ resetToken, password }) => ({
          url: `auth/reset-password/${resetToken}`,
          method: 'POST',
          body: { password },
        }),
      }),

      // Get Categories
      getCategories: builder.query({
        query: () => ({
          url: '/categories',
          method: 'GET',
        }),
      }),

      // Get Category
      getCategory: builder.query({
        query: categoryId => ({
          url: `/categories/${categoryId}`,
          method: 'GET',
        }),
      }),

      // Get Sub Categories
      getSubcategories: builder.query({
        query: () => ({
          url: '/sub-categories',
          method: 'GET',
        }),
      }),

      // Get Brands
      getBrands: builder.query({
        query: () => ({
          url: '/brands',
          method: 'GET',
        }),
      }),

      // Create User
      createUser: builder.mutation({
        query: data => ({
          url: '/users',
          method: 'POST',
          body: data,
        }),
      }),
      // Create User
      createUserWithGoogle: builder.mutation({
        query: data => ({
          url: '/users/oath/google',
          method: 'POST',
          body: data,
        }),
      }),

      // Get Users
      getCurrentUser: builder.query({
        query: () => ({
          url: `/users/me`,
          method: 'GET',
        }),
      }),

      // Add to Cart
      addToCart: builder.mutation({
        query: data => ({
          url: '/cart',
          method: 'POST',
          body: data,
        }),
      }),

      // Get User Cart items
      getUserCartItems: builder.query({
        query: ({ currency }) => {
          const queryString = 'cart?';
          const params = new URLSearchParams();
          if (currency !== undefined) params.append('currency', currency);
          return queryString + params.toString();
        },
      }),

      // Update User CartItem
      updateUserCartItem: builder.mutation({
        query: ({ id, quantity }) => ({
          url: `/cart/${id}`,
          method: 'PUT',
          body: { quantity },
        }),
      }),

      // Delete a User CartItem
      deleteUserCartItem: builder.mutation({
        query: (id: number) => ({
          url: `/cart/${id}`,
          method: 'DELETE',
        }),
      }),

      // Get Users Cart Products
      getUsersCartProducts: builder.query({
        query: () => ({
          url: `/users/cart/products`,
          method: 'GET',
        }),
      }),

      // Add to Wishlist
      addToWishlist: builder.mutation({
        query: data => ({
          url: '/wishlist',
          method: 'POST',
          body: data,
        }),
      }),

      // Get Users Wishlist Products
      getUsersWishlistProducts: builder.query({
        query: () => ({
          url: `/users/wishlist/products`,
          method: 'GET',
        }),
      }),

      // Get User wishlist items
      getUserWishlistItems: builder.query({
        query: ({ currency }) => {
          const queryString = 'wishlist?';
          const params = new URLSearchParams();
          if (currency !== undefined) params.append('currency', currency);
          return queryString + params.toString();
        },
      }),

      // Update User wishlist
      updateUserWishlistItem: builder.mutation({
        query: ({ id, quantity }) => ({
          url: `/wishlist/${id}`,
          method: 'PUT',
          body: { quantity },
        }),
      }),

      // Delete a User wishlist
      deleteUserWishlistItem: builder.mutation({
        query: (id: number) => ({
          url: `/wishlist/${id}`,
          method: 'DELETE',
        }),
      }),

      // Update User
      updateUser: builder.mutation({
        query: ({ id, data }: { id: number; data: User }) => ({
          url: `/users/${id}`,
          method: 'PUT',
          body: data,
        }),
      }),

      // Get Currency
      getCurrencies: builder.query({
        query: () => ({
          url: '/currencies',
          method: 'GET',
        }),
      }),

      getFaqs: builder.query({
        query: () => ({
          url: '/faqs',
          method: 'GET',
        }),
      }),

      createMessage: builder.mutation({
        query: data => ({
          url: '/messages',
          method: 'POST',
          body: data,
        }),
      }),

      subscribeNewsletter: builder.mutation({
        query: data => ({
          url: '/newsLetters/subscribe',
          method: 'POST',
          body: data,
        }),
      }),

      // Get Products
      getProducts: builder.query({
        query: ({ page, limit, currency }) => {
          const queryString = 'products?';
          const params = new URLSearchParams();
          if (page !== undefined) params.append('page', page.toString());
          if (limit !== undefined) params.append('limit', limit.toString());
          if (currency !== undefined) params.append('currency', currency);
          return queryString + params.toString();
        },
      }),

      // Get Category Products
      getCategoryProducts: builder.query({
        query: categoryId => ({
          url: `/products/category/${categoryId}`,
          method: 'GET',
        }),
      }),

      // Get Subcategory Products
      getSubcategoryProducts: builder.query({
        query: subcategoryId => ({
          url: `/products/subcategory/${subcategoryId}`,
          method: 'GET',
        }),
      }),

      // Get Subcategories by Category
      getSubcategoriesByCategory: builder.query({
        query: categoryId => ({
          url: `/sub-categories/category/${categoryId}`,
          method: 'GET',
        }),
      }),

      // Search Products
      searchProducts: builder.query({
        query: ({ query, categoryId, currency = 'Rwf' }) => {
          const queryString = 'products/search?';
          const params = new URLSearchParams();

          if (query?.trim()) params.append('query', query.trim());
          if (categoryId != null) params.append('categoryId', categoryId.toString());
          params.append('currency', currency);

          return queryString + params.toString();
        },
      }),

      // Get Product
      getProduct: builder.query({
        query: ({ id, currency = 'Rwf' }) => {
          const queryString = `products/${id}?`;
          const params = new URLSearchParams();
          params.append('currency', currency);

          return queryString + params.toString();
        },
      }),

      // User orders
      getUserOrders: builder.query({
        query: () => ({
          url: '/orders/user',
          method: 'GET',
        }),
      }),

      // Cancel Order
      cancelOrder: builder.mutation({
        query: (id: number) => ({
          url: `/order/${id}`,
          method: 'DELETE',
        }),
      }),

      // Process Payment
      processPayment: builder.mutation({
        query: data => ({
          url: `/payments/process`,
          method: 'POST',
          body: data,
        }),
      }),

      // Update payment status
      updatePaymentStatus: builder.mutation({
        query: ({ id, status }: { id: number; status: string }) => ({
          url: `/payments/${id}/status`,
          method: 'PUT',
          body: { status },
        }),
      }),

      getUserAnalyticsData: builder.query({
        query: () => ({
          url: '/analytics/user',
          method: 'GET',
        }),
      }),

      // Get User Addresses
      getUserAddresses: builder.query({
        query: () => ({
          url: '/addresses',
          method: 'GET',
        }),
      }),

      // Create User Address
      createUserAddress: builder.mutation({
        query: data => ({
          url: '/addresses',
          method: 'POST',
          body: data,
        }),
      }),

      // Update User Address
      updateUserAddress: builder.mutation({
        query: ({ id, data }: { id: number; data: Color }) => ({
          url: `/addresses/${id}`,
          method: 'PUT',
          body: data,
        }),
      }),

      // Delete User Address
      deleteUserAddress: builder.mutation({
        query: (id: number) => ({
          url: `/addresses/${id}`,
          method: 'DELETE',
        }),
      }),
    };
  },
});

export const {
  useLoginMutation,
  useLoginWithGoogleMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetSubcategoriesQuery,
  useGetBrandsQuery,
  useCreateUserMutation,
  useCreateUserWithGoogleMutation,
  useGetCurrentUserQuery,
  useAddToCartMutation,
  useGetUserCartItemsQuery,
  useUpdateUserCartItemMutation,
  useDeleteUserCartItemMutation,
  useGetUsersCartProductsQuery,
  useAddToWishlistMutation,
  useGetUserWishlistItemsQuery,
  useGetUsersWishlistProductsQuery,
  useUpdateUserWishlistItemMutation,
  useDeleteUserWishlistItemMutation,
  useUpdateUserMutation,
  useGetCurrenciesQuery,
  useGetProductsQuery,
  useGetCategoryProductsQuery,
  useGetSubcategoryProductsQuery,
  useGetSubcategoriesByCategoryQuery,
  useSearchProductsQuery,
  useGetFaqsQuery,
  useCreateMessageMutation,
  useSubscribeNewsletterMutation,
  useGetProductQuery,
  useProcessPaymentMutation,
  useUpdatePaymentStatusMutation,
  useGetUserOrdersQuery,
  useCancelOrderMutation,
  useGetUserAnalyticsDataQuery,
  useCreateUserAddressMutation,
  useGetUserAddressesQuery,
  useUpdateUserAddressMutation,
  useDeleteUserAddressMutation,
} = apiSlice;
