export type SceneImageProps = {
  scene: {
    id: string;
    name: string;
    url: string;
    characters: {
      character: {
        id: string;
        name: string;
      };
    }[];
  };
};

export type CharacterMenuProps = {
  characters: { id: string; name: string }[];
  position: { x: number; y: number };
  onCharacterSelect: (character: { id: string; name: string }) => void;
};
