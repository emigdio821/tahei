interface FolderPageProps {
  params: Promise<{ id: string }>
}

export default async function FolderPage(props: FolderPageProps) {
  const params = await props.params

  return (
    <div>
      <h1>{params.id}</h1>
    </div>
  )
}
