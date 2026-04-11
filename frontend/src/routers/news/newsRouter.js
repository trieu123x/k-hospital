import axiosInstance from "@/utils/axios";

export const newsApi = {
  getNewsList: async (params) => {
    const response = await axiosInstance.get("/news", { params });
    return response; 
  },

  getNewsDetail: async (newsId) => {
    const response = await axiosInstance.get(`/news/${newsId}`);
    return response; 
  },
};