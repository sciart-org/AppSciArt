export default function NotFound({ resource }) {
  if (resource) {
    return <h2>404 - Resource not found!</h2>;
  }
  return <h2>404 - Page not found!</h2>;
}
