export default function Form({ children, autoComplete }) {
  return <form autoComplete={autoComplete}>{children}</form>;
}
