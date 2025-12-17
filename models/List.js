export default function List({ id, title, createdAt, items = [], image = null }) {
  return {
    id,
    title,
    createdAt,
    items,
    image,
  };
}