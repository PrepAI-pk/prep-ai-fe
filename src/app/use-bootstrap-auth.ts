import { useEffect, useRef } from "react";
import { useRefreshMutation } from "../api/auth/auth.endpoints";
import { useLazyGetMeQuery } from "../api/me/me.endpoints";
import { useAppDispatch } from "../store/hooks";
import {
  accessTokenRefreshed,
  authEnded,
  authLoading,
  authSucceeded,
  type BackendRole,
} from "../store/slices/auth-slice";

// Exchanges the httpOnly refresh-token cookie (if any) for a fresh access
// token, then loads the user bootstrap payload — runs once on app mount.
// Access tokens live in memory only, so this is what makes a reload not
// bounce the user back to /auth.
export function useBootstrapAuth(): void {
  const dispatch = useAppDispatch();
  const [refresh] = useRefreshMutation();
  const [getMe] = useLazyGetMeQuery();

  // A ref (not Redux state, not a `cancelled`-flag cleanup) guards against
  // running twice. Two things this deliberately avoids:
  // 1. Reading `status` as a dependency: dispatching authLoading() changes
  //    it, which would re-trigger this same effect.
  // 2. A `cancelled`-on-cleanup pattern: StrictMode's dev-mode mount→cleanup
  //    →mount cycle runs cleanup on the *first* (only real, since the ref
  //    blocks a second) effect instance before its async work resolves —
  //    the request fires, 401s, and the result gets silently discarded
  //    because "cancelled" is already true by the time it settles. This is a
  //    one-time app-boot sequence, not a subscription; it doesn't need
  //    cancellation semantics, so there's nothing to guard here.
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) {
      return;
    }
    hasStarted.current = true;

    dispatch(authLoading());

    void (async () => {
      try {
        const { accessToken } = await refresh().unwrap();
        dispatch(accessTokenRefreshed({ accessToken }));

        const me = await getMe().unwrap();
        dispatch(
          authSucceeded({
            accessToken,
            user: {
              id: me.id,
              fullName: me.fullName,
              avatarInitials: me.avatarInitials,
              role: me.role as BackendRole,
              onboardedAt: me.onboardedAt,
              emailVerifiedAt: me.emailVerifiedAt,
            },
          }),
        );
      } catch {
        dispatch(authEnded());
      }
    })();
  }, [dispatch, refresh, getMe]);
}
