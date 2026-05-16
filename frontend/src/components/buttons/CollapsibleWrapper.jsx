export default function CollapsibleWrapper({ collapsed, children }) {
  return <>{collapsed ? null : children}</>;
}
