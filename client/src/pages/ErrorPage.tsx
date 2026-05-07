


export default function ErrorPage({ error }: { error: Error }) {
    return (
        <div>
            <h1 className="text-2xl font-bold">Error</h1>
            <p>{error.message}</p>
        </div>
    )
}