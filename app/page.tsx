import GetPosts from "./_components/getPosts/page";
import CreatePost from "./_components/postPosts/page";

export default function Page() {
  return (
    <div className="bg-white">
      <CreatePost />
      <GetPosts />
    </div>
  );
}
