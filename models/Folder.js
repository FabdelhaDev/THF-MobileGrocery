export default function Folder({ id, name, description = '', lists = [] }) {
  return {
    id, 
    name,
    description,
    lists, 
  };
}
