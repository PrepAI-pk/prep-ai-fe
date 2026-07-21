// A leaf module (no app/router imports) so it can be safely imported from
// baseApi.ts without creating a cycle back through the route tree. Holds
// whatever the current router's imperative navigate function is, set once
// from RootLayout on mount.
type NavigateFn = (path: string) => void;

let navigate: NavigateFn | null = null;

export function setGlobalNavigate(fn: NavigateFn): void {
  navigate = fn;
}

export function navigateGlobally(path: string): void {
  navigate?.(path);
}
