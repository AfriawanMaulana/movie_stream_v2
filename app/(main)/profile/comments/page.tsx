"use client";
import { MessageCircle, Trash2 } from "lucide-react";
import { CommentType } from "@/types/commentType";
import { useEffect, useState } from "react";
import { deleteComments, getMyComments } from "@/app/actions/addComments";
import Link from "next/link";
import { toast } from "react-toastify";

function CommentsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-secondary/2 p-4 rounded-2xl space-y-2 w-full flex justify-between"
        >
          <div className="space-y-2 w-full">
            <div className="h-5 w-1/2 rounded bg-secondary/10 animate-pulse" />
            <div className="h-4 w-full rounded bg-secondary/10 animate-pulse" />
            <div className="h-4 w-3/4 rounded bg-secondary/10 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getMyComments();

        if (Array.isArray(res)) {
          setComments(res);
        } else if (res.success) {
          setComments(res.data);
        } else {
          toast.error(res.error);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  const handleDeleteComments = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const commentId = e.currentTarget.value;

    try {
      const res = await deleteComments(commentId);
      if (res.success) {
        setComments((prev) => prev.filter((item) => item.id !== commentId));
        toast.success(res.message);
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete comment");
    }
  };

  const slugify = (str?: string) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  return (
    <section className="px-5 lg:px-14 pt-32 pb-20 space-y-6">
      <div className="flex gap-2 items-center border-b border-white/20 pb-4 mb-4">
        <MessageCircle size={32} color="yellow" />
        <h1 className="text-2xl font-bold">My Comments</h1>
      </div>

      {loading ? (
        <CommentsSkeleton />
      ) : comments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full items-start">
          {comments.map((item) => (
            <Link
              key={item.id}
              href={`/${item.category}/${slugify(item.title)}?id=${
                item.movie_id
              }#comment-${item.id}`}
              className="bg-secondary/2 p-4 rounded-2xl space-y-2 w-full flex justify-between hover:text-red-600 hover:bg-secondary/5 transition-all ease-in-out duration-300"
            >
              <div>
                <h2 className="font-semibold text-lg">{item.title}</h2>
                <p className="text-secondary/60 line-clamp-2">{item.message}</p>
              </div>
              <button
                onClick={handleDeleteComments}
                value={item.id}
                className="text-red-800 hover:text-red-600 cursor-pointer"
              >
                <Trash2 />
              </button>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center w-full">
          <p className="opacity-70">
            You haven&apos;t commented on anything yet.
          </p>
        </div>
      )}
    </section>
  );
}
