export default async function SceneDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h1>Scene #{id}</h1>
      <p>Game board here</p>
    </div>
  );
}
