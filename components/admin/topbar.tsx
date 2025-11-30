export function AdminTopbar() {
  return (
    <header className="h-14 sm:h-16 border-b border-neutral-200 bg-white flex items-center justify-between px-4 pl-16 md:pl-4">
      <div className="text-sm font-medium text-neutral-900 truncate">One Piece Admin</div>
      <div className="text-xs text-neutral-500 hidden sm:block">Signed in as admin@example.com</div>
    </header>
  );
}
