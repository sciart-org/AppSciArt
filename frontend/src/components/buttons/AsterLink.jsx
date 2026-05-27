import { Link } from "react-router";

export default function AsterLink({ to, children, onClick, ...props }) {
  const linkOnClick = to
    ? undefined
    : (e) => {
        e.preventDefault();
        onClick();
      };

  return (
    <Link to={to} tabIndex={0} onClick={linkOnClick} {...props}>
      {children}
    </Link>
  );
}
