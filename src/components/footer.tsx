export function Footer() {
  return (
    <footer className="mt-auto flex items-center justify-center gap-2 p-4 sm:p-6">
      <span className="flex h-5 items-center gap-2 text-sm">
        <span>{new Date().getFullYear()}</span>
        <div className="h-4 w-px bg-border" />
        <span className="font-medium">Tahei</span>
      </span>
    </footer>
  )
}
