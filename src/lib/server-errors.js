import { unstable_rethrow } from "next/navigation";

/**
 * Call in catch blocks around server fetches so redirect()/notFound() still work.
 * Must be called before any other error handling.
 */
export function rethrowNavigationError(error) {
    unstable_rethrow(error);
}
