

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        {/* no data found */}
        <h1 className="text-2xl font-bold mb-4">No Data Found</h1>
        <p className="text-lg text-muted-foreground">We couldn't find any data to display.</p>
    </div>
  )
}
