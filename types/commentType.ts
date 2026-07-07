export interface CommentType {
  id: string;
  user_id: string;
  movie_id: string;
  title: string;
  username: string;
  message: string;
  category: "movie" | "tv";
  createdAt: Date;
}
