export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  USER_EVENTS: "/user/events",
  USER_PROFILE: "/user/profile",
  EVENT_SEARCH: "/event/search",
  EVENT_CREATE: "/event/create",
  eventDetail: (id: string | number) => `/event/${id}`,
} as const;

export default ROUTES;
