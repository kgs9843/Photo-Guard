# React Router — passing location state (official references)

- [React Router — `useNavigate`](https://reactrouter.com/en/main/hooks/use-navigate)
- [React Router — `useLocation`](https://reactrouter.com/en/main/hooks/use-location)

Notes:

- Use `navigate('/path', { state })` to pass non-URL state between routes.
- This state is not durable across hard refresh; keep it for transient UI flow only.
