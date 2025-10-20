type Props = {
  listView: boolean;
  setListView: (_: boolean) => void;
};

export default function ToggleView({ listView, setListView }: Props) {
  return (
    <div className="toggleView">
      <img
        src="list.png"
        className={listView ? "selected" : ""}
        onClick={() => setListView(true)}
      />
      <img
        src="/grid.png"
        className={!listView ? "selected" : ""}
        onClick={() => setListView(false)}
      />
    </div>
  );
}
