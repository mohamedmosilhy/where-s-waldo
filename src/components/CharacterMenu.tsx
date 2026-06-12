export function CharacterMenu({
  characters,
  position,
  onCharacterSelect,
}: {
  characters: { id: string; name: string }[];
  position: { x: number; y: number };
  onCharacterSelect: (character: { id: string; name: string }) => void;
}) {
  return (
    <div
      className="bg-gray-100 p-4 absolute rounded shadow-lg w-64"
      onClick={(event) => event.stopPropagation()}
      style={{
        left: `${(position.x + 0.01) * 100}%`,
        top: `${(position.y + 0.05) * 100}%`,
      }}
    >
      <h2 className="font-semibold">Characters</h2>
      <ul className="flex flex-wrap gap-4 p-4">
        {characters.map((character) => (
          <li
            className="border rounded border-gray-300 p-4 w-full text-center"
            key={character.id}
          >
            <button onClick={() => onCharacterSelect(character)}>
              {character.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
