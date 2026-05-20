import { Link } from "react-router";

export default function AsterLink({ to, children, ...props }) {
  return (
    <Link to={to} tabIndex={0} {...props}>
      {children}
    </Link>
  );
}
