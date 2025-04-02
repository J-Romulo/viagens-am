export function PageTitle({ title }: { title: string }) {
    return (
        <div className="flex items-center justify-between w-full p-2 text-primary-500">
            <h1 className="text-2xl font-bold">{title}</h1>
        </div>
    )
}