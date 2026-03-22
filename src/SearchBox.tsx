import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onChange: (query: string) => void;
}

const SearchBox = ({ onChange }: SearchBoxProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes..."
      onChange={handleChange}
    />
  );
};

export default SearchBox;
