export default function Item({ id, text, checked = false, createdAt }) {
  return {
    id,
    text,
    checked,
    createdAt,
  };
}