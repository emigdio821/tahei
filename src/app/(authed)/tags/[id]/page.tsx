interface TagPageProps {
  params: Promise<{ id: string }>
}

export default async function TagPage(props: TagPageProps) {
  const params = await props.params

  return (
    <div>
      <h1>{params.id}</h1>
    </div>
  )
}
