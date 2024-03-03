export {default} from "next-auth/middleware"


export const config = { matcher: ["/welcome", "/attendance/:path*"] };

// old version:
// export const config = { matcher: ["/welcome", "/attendance/week1", "/attendance/week2", "/attendance/completed"] };