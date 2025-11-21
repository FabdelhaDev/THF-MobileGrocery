export default function List({ id, title, createdAt, items = [] }) {
  return {
    id,
    title,
    createdAt,
    items, 
  };
}