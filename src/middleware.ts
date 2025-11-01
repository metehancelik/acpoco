import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // api ile başlayan tüm yolları hariç tut
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
