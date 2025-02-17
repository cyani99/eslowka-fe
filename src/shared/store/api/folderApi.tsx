import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IFolder, INewWord, INewWords } from "../slices/FolderSlice";
import { RootState } from "..";

//http://localhost:3000/users/669787b41e2ea369890f4f67/folders/0/words
const foldersApi = createApi({
  reducerPath: "folders",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_testApiUrl+"folders/",
    prepareHeaders: async (headers, { getState }) => {
      const store = (await getState()) as RootState;
      // console.log("myTOKEN",store.userProfile.token);
      // console.log("UID",store.userProfile.value);
      if (store) {
        headers.set("Authorization", `${store.userProfile.token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Words", "Folders", "User", "Stories"],
  endpoints(builder) {
    return {
      getUserFolders: builder.query({
        providesTags: ["Folders"],
        query: (userID) => {
          return {
            url: `/${userID}/folders/`,
            method: "GET",
          };
        },
      }),
      getFolderByReferenceCode: builder.query({
        providesTags: ["Folders"],
        query: (data: { referenceCode: string }) => {
          console.log(data.referenceCode);
          return {
            url: `/getByReferenceCode/${data.referenceCode}/referenceCode/reference`,
            method: "GET",
          };
        },
      }),
      getSingleFolder: builder.query({
        providesTags: ["Folders"],
        query: (data: { folderName: string; userID: string }) => {
          return {
            url: `/${data.userID}/${data.folderName}`,
            method: "GET",
          };
        },
      }),
      getAllWordsInFolder: builder.query({
        providesTags: ["Words"],
        query: (data: { folderID: string; userID: string }) => {
          return {
            url: `/${data.userID}/folders/${data.folderID}/words`,
            method: "GET",
          };
        },
      }),
      getRandomFolderWords: builder.query({
        providesTags: ["Words"],
        query: (data:{folderID:string, userID: string}) => {
          return {
            url: `/${data.userID}/folders/${data.folderID}/randomWords`,
            method: "GET",
          };
        },
      }),
      createFolder: builder.mutation({
        invalidatesTags: ["Folders"],
        query: (data:{newFolder: IFolder, userID: string}) => {
          return {
            url: `/${data.userID}/`,
            method: "PATCH",
            body: data.newFolder,
          };
        },
      }),
      createWordInFolder: builder.mutation({
        invalidatesTags: ["Words", "Folders"],
        query: (data:{newWord: INewWord, userID: string}) => {
          return {
            url: `/${data.userID}/word`,
            method: "PATCH",
            body: {newWord: data.newWord.word, folderId: data.newWord.folderID},
          };
        },
      }),
      createMultipleWordsInFolder: builder.mutation({
        invalidatesTags: ["Words", "Folders"],
        query: (data:{newWords: INewWords, userID: string}) => {
          return {
            url: `/${data.userID}/words`,
            method: "PATCH",
            body: data.newWords.words,
          };
        },
      }),
      updateFolderDefaultVoice: builder.mutation({
        invalidatesTags: ["Words", "Folders"],
        query: (data:{voice:any, userID: string, folderID: string}) => {
          console.log(data.voice)
          return {
            url: `/${data.userID}/${data.folderID}/defaultVoice`,
            method: "PATCH",
            body: {voice:data.voice},
          };
        },
      }),
      updateFolderSecondaryVoice: builder.mutation({
        invalidatesTags: ["Words", "Folders"],
        query: (data:{voice:any, userID: string, folderID: string}) => {
          return {
            url: `/${data.userID}/${data.folderID}/secondaryVoice`,
            method: "PATCH",
            body: {voice:data.voice},
          };
        },
      }),
      updateFolderName: builder.mutation({
        invalidatesTags: ["Words", "Folders"],
        query: (data:{newName:string, userID: string, folderID: string}) => {
          return {
            url: `/${data.userID}/${data.folderID}/rename`,
            method: "PATCH",
            body: {newName:data.newName},
          };
        },
      }),
      updateWordDetails: builder.mutation({
        invalidatesTags: ["Words", "Folders"],
        query: (data:{updatedWord: INewWord, userID: string}) => {
          return {
            url: `/${data.userID}/word/details`,
            method: "PATCH",
            body: data.updatedWord.word,
          };
        },
      }),
      updateWordStatusAndStreak: builder.mutation({
        invalidatesTags: ["Words", "Folders"],
        query: (data:{updatedWord: INewWord, userID: string}) => {
          return {
            url: `/${data.userID}/word/status`,
            method: "PATCH",
            body: data.updatedWord.word,
          };
        },
      }),
      deleteWordInFolder: builder.mutation({
        invalidatesTags: ["Words", "Folders"],
        query: (data:{wordToRemove: INewWord, userID: string}) => {
          return {
            url: `/${data.userID}/word`,
            method: "DELETE",
            body: data.wordToRemove.word,
          };
        },
      }),
      deleteUserFolder: builder.mutation({
        invalidatesTags: ["Words", "Folders"],
        query: (data:{folderToRemove: IFolder, userID: string}) => {
          return {
            url: `/${data.userID}/folder`,
            method: "DELETE",
            body: data.folderToRemove,
          };
        },
      }),
    };
  },
});

export const {
  useGetUserFoldersQuery,
  useGetFolderByReferenceCodeQuery,
  useGetSingleFolderQuery,
  useGetAllWordsInFolderQuery,
  useGetRandomFolderWordsQuery,
  useCreateFolderMutation,
  useCreateWordInFolderMutation,
  useCreateMultipleWordsInFolderMutation,
  useUpdateFolderDefaultVoiceMutation,
  useUpdateFolderSecondaryVoiceMutation,
  useUpdateFolderNameMutation,
  useUpdateWordDetailsMutation,
  useUpdateWordStatusAndStreakMutation,
  useDeleteWordInFolderMutation,
  useDeleteUserFolderMutation
} = foldersApi;
export { foldersApi };
