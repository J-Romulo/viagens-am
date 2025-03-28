import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="size-full flex flex-col items-center justify-center">
      <main className="w-5/6 h-fit md:w-4/6 md:h-4/6 p-1 md:p-6 flex flex-col items-start bg-white rounded-lg shadow-2xl">
        <div className="w-full flex md:flex-row items-center gap-x-3">
          <Image src={"/"} alt="Pageproof logo" width={150} height={100} />
          <h1 className="text-5xl">PageProof - Images commenter</h1>
        </div>

        <div className="w-2/3 flex flex-row justify-center mx-auto mt-8">
          <p className="text-center text-3xl">
            Upload an image, add comments, and view them all in one place.
            Simple and user-friendly!
          </p>
        </div>

        <div className="w-full flex flex-col gap-y-5 md:flex-row items-center mt-auto">
          <Link
            href={"/signIn"}
            className="p-4 w-60 mx-auto bg-primary rounded-xl shadow-lg flex items-center justify-center hover:bg-light_primary transition-all"
          >
            <div>
              <div className="text-xl font-medium text-white">Sign In</div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
