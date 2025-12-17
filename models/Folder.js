export default function Folder({ id, name, description = '', lists = [], image = null }) {
  return {
    id,
    name,
    description,
    lists,
    image,
  };
}

