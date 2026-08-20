import api from "@/api/axios";

export type ImageDirName = "NATION" | "FEED" | "ORDER";

// 이미지 업로드
export const uploadImage = async (file: File, dirName: ImageDirName) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post<{
    success: boolean;
    code: number;
    message: string;
    data: {
      imageUrl: string;
    };
  }>(`/api/images?dirName=${dirName}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data.imageUrl;
};
