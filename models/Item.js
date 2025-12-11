export default function Item({ id, text, checked = false, createdAt, image = null }) {
  return {
    id,
    text,
    checked,
    createdAt,
    image,
  };
}