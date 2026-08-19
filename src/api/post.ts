import api from "@/api/axios";

export interface PostSummary {
  postId: number;
  thumbnailURL: string;
}

export const getPosts = async (journeyId: number) => {
  const response = await api.get<{
    success: boolean;
    code: number;
    message: string;
    data: PostSummary[];
  }>(`/api/journeys/${journeyId}/posts`);

  return response.data.data;
};

export interface PostPhoto {
  photoId: number;
  imgURL: string;
}

export interface PostDetail {
  postId: number;
  nationFlagURL: string;
  nationKRName: string;
  journeyType: string;
  date: string;
  photoList: PostPhoto[];
  comment: string;
  photoCount: number;
  commentLength: number;
  isPublic: boolean;
}

export const getPost = async (postId: number) => {
  const response = await api.get<{
    success: boolean;
    code: number;
    message: string;
    data: PostDetail;
  }>(`/api/posts/${postId}`);

  return response.data.data;
};

export interface CreatePostRequest {
  comment: string;
  isPublic: boolean;
  imgUrlList: string[];
}

export const createPost = async (journeyId: number, payload: CreatePostRequest) => {
  const response = await api.post<{
    success: boolean;
    code: number;
    message: string;
    data: PostDetail;
  }>(`/api/journeys/${journeyId}/posts`, payload);

  return response.data.data;
};

export interface UpdatePostRequest {
  comment: string;
  isPublic: boolean;
  imgUrlList: string[];
}

export const updatePost = async (postId: number, payload: UpdatePostRequest) => {
  const response = await api.put<{
    success: boolean;
    code: number;
    message: string;
    data: PostDetail;
  }>(`/api/posts/${postId}`, payload);

  return response.data.data;
};

export const deletePost = async (postId: number) => {
  const response = await api.delete<{
    success: boolean;
    code: number;
    message: string;
    data: string;
  }>(`/api/posts/${postId}`);

  return response.data.data;
};
