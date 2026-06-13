export type ScenesList = Promise<
  {
    id: string;
    name: string;
    url: string;
  }[]
>;

export type SceneDetail = Promise<{
  id: string;
  name: string;
  url: string;
  characters: {
    character: {
      id: string;
      name: string;
    };
  }[];
}>;
