export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 px-4">
      <div
        className="h-8 w-8 rounded-full border-2 border-border border-t-primary animate-spin"
        aria-hidden
      />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
