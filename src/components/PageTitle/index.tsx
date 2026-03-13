export function PageTitle({ title }: { title: string }) {
  return (
    <div className='text-primary-500 flex w-full items-center justify-between p-2'>
      <h1 className='text-xl font-bold'>{title}</h1>
    </div>
  );
}
