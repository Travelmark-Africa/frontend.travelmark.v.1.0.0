import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

const { VITE_APP_BASE_API_URL } = import.meta.env;

// Base query with reauthentication logic
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

  // Handle token expiration
  const errorData = result.error?.data as { code?: string } | undefined;
  if (errorData && errorData.code === 'EXPIREDTOKEN') {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  return result;
};

// Create the API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    // Auth endpoints
    login: builder.mutation({
      query: data => ({
        url: 'auth/login',
        method: 'POST',
        body: data,
      }),
    }),
    loginWithGoogle: builder.mutation({
      query: data => ({
        url: 'auth/login/oath/google',
        method: 'POST',
        body: data,
      }),
    }),
    forgotPassword: builder.mutation({
      query: data => ({
        url: 'auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ resetToken, password }) => ({
        url: `auth/reset-password/${resetToken}`,
        method: 'POST',
        body: { password },
      }),
    }),

    // User endpoints
    getUsers: builder.query({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
    }),
    createUser: builder.mutation({
      query: data => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: ({ userId, data }) => ({
        url: `/users/${userId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteUser: builder.mutation({
      query: userId => ({
        url: `/users/${userId}`,
        method: 'DELETE',
      }),
    }),

    // Role endpoints
    getRoles: builder.query({
      query: () => ({
        url: '/roles',
        method: 'GET',
      }),
    }),

    // Destination endpoints
    getDestinations: builder.query({
      query: () => ({
        url: '/destinations',
        method: 'GET',
      }),
    }),
    createDestination: builder.mutation({
      query: data => ({
        url: '/destinations',
        method: 'POST',
        body: data,
      }),
    }),
    getDestination: builder.query({
      query: destinationId => ({
        url: `/destinations/${destinationId}`,
        method: 'GET',
      }),
    }),
    updateDestination: builder.mutation({
      query: ({ destinationId, data }) => ({
        url: `/destinations/${destinationId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteDestination: builder.mutation({
      query: destinationId => ({
        url: `/destinations/${destinationId}`,
        method: 'DELETE',
      }),
    }),

    // Trip Plan endpoints
    getTripPlans: builder.query({
      query: () => ({
        url: '/trip-plans',
        method: 'GET',
      }),
    }),
    createTripPlan: builder.mutation({
      query: data => ({
        url: '/trip-plans',
        method: 'POST',
        body: data,
      }),
    }),
    getTripPlan: builder.query({
      query: tripPlanId => ({
        url: `/trip-plans/${tripPlanId}`,
        method: 'GET',
      }),
    }),
    updateTripPlan: builder.mutation({
      query: ({ tripPlanId, data }) => ({
        url: `/trip-plans/${tripPlanId}`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteTripPlan: builder.mutation({
      query: tripPlanId => ({
        url: `/trip-plans/${tripPlanId}`,
        method: 'DELETE',
      }),
    }),

    // Booking endpoints
    getBookings: builder.query({
      query: () => ({
        url: '/bookings',
        method: 'GET',
      }),
    }),
    createBooking: builder.mutation({
      query: data => ({
        url: '/bookings',
        method: 'POST',
        body: data,
      }),
    }),
    getBooking: builder.query({
      query: bookingId => ({
        url: `/bookings/${bookingId}`,
        method: 'GET',
      }),
    }),
    updateBooking: builder.mutation({
      query: ({ bookingId, data }) => ({
        url: `/bookings/${bookingId}`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteBooking: builder.mutation({
      query: bookingId => ({
        url: `/bookings/${bookingId}`,
        method: 'DELETE',
      }),
    }),

    // Favorite endpoints
    getFavorites: builder.query({
      query: () => ({
        url: '/favorites',
        method: 'GET',
      }),
    }),
    createFavorite: builder.mutation({
      query: data => ({
        url: '/favorites',
        method: 'POST',
        body: data,
      }),
    }),
    deleteFavorite: builder.mutation({
      query: favoriteId => ({
        url: `/favorites/${favoriteId}`,
        method: 'DELETE',
      }),
    }),

    // Review endpoints
    createReview: builder.mutation({
      query: data => ({
        url: '/reviews',
        method: 'POST',
        body: data,
      }),
    }),
    updateReview: builder.mutation({
      query: ({ reviewId, data }) => ({
        url: `/reviews/${reviewId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    deleteReview: builder.mutation({
      query: reviewId => ({
        url: `/reviews/${reviewId}`,
        method: 'DELETE',
      }),
    }),

    // Country endpoints
    getCountries: builder.query({
      query: () => ({
        url: '/countries',
        method: 'GET',
      }),
    }),
    createCountry: builder.mutation({
      query: data => ({
        url: '/countries',
        method: 'POST',
        body: data,
      }),
    }),
    getCountry: builder.query({
      query: countryId => ({
        url: `/countries/${countryId}`,
        method: 'GET',
      }),
    }),
    updateCountry: builder.mutation({
      query: ({ countryId, data }) => ({
        url: `/countries/${countryId}`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteCountry: builder.mutation({
      query: countryId => ({
        url: `/countries/${countryId}`,
        method: 'DELETE',
      }),
    }),

    // Activity endpoints
    getActivities: builder.query({
      query: () => ({
        url: '/activities',
        method: 'GET',
      }),
    }),
    createActivity: builder.mutation({
      query: data => ({
        url: '/activities',
        method: 'POST',
        body: data,
      }),
    }),
    getActivity: builder.query({
      query: activityId => ({
        url: `/activities/${activityId}`,
        method: 'GET',
      }),
    }),
    updateActivity: builder.mutation({
      query: ({ activityId, data }) => ({
        url: `/activities/${activityId}`,
        method: 'PATCH',
        body: data,
      }),
    }),
    deleteActivity: builder.mutation({
      query: activityId => ({
        url: `/activities/${activityId}`,
        method: 'DELETE',
      }),
    }),

    // Search endpoints
    searchDestinations: builder.query({
      query: query => ({
        url: '/search',
        method: 'GET',
        params: { query },
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useLoginWithGoogleMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetRolesQuery,
  useGetDestinationsQuery,
  useCreateDestinationMutation,
  useGetDestinationQuery,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
  useGetTripPlansQuery,
  useCreateTripPlanMutation,
  useGetTripPlanQuery,
  useUpdateTripPlanMutation,
  useDeleteTripPlanMutation,
  useGetBookingsQuery,
  useCreateBookingMutation,
  useGetBookingQuery,
  useUpdateBookingMutation,
  useDeleteBookingMutation,
  useGetFavoritesQuery,
  useCreateFavoriteMutation,
  useDeleteFavoriteMutation,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetCountriesQuery,
  useCreateCountryMutation,
  useGetCountryQuery,
  useUpdateCountryMutation,
  useDeleteCountryMutation,
  useGetActivitiesQuery,
  useCreateActivityMutation,
  useGetActivityQuery,
  useUpdateActivityMutation,
  useDeleteActivityMutation,
  useSearchDestinationsQuery,
} = apiSlice;