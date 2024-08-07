import { FC } from "react";
import { IFolder, IWord } from "../../../../shared/store/slices/FolderSlice";
import { FaFire, FaSkull } from "react-icons/fa6";
import WordStatusForm from "./WordStatusForm";
import { FaTrashAlt } from "react-icons/fa";
import { RootState, useRemoveWordMutation } from "../../../../shared/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export const WordsTable: FC<{ renderedWords: JSX.Element | undefined }> = (
  props
): JSX.Element => {
  return (
    <table>
      <tr className="bg-secondary h-14 text-white ">
        <th className="border-r-4 border-white">Słowo</th>
        <th className="border-r-4 border-white">Tłumaczenie</th>
        <th className="border-r-4 border-white">Status</th>
        <th className="rounded-tr-xl">Opcje</th>
      </tr>
      {props.renderedWords}
    </table>
  );
};

const WordRenderer: FC<{
  data: IWord[];
  folder: IFolder;
  setNewID: (newID: number) => void;
}> = (props): JSX.Element => {
  const user = useSelector((state: RootState) => state.userProfile);

  const [removeWord] = useRemoveWordMutation();
  let tr: any;
  //IF WORDS TABLE IS NOT EMPTY
  if (props.data.length !== 0) {
    tr = props.data.map((word: IWord, index: number) => {
      let streakIcon;
      if (word.streak >= 5 && word.streak < 15) {
        streakIcon = <FaFire className=" text-2xl text-orange-600" />;
      } else if (word.streak >= 15 && word.streak < 35) {
        streakIcon = <FaFire className=" text-2xl text-zinc-400" />;
      } else if (word.streak >= 35) {
        streakIcon = <FaFire className=" text-2xl text-gold" />;
      } else if (word.reverseStreak >= 5) {
        streakIcon = <FaSkull className=" text-2xl text-red-600" />;
      } else {
        streakIcon = <FaFire className=" text-2xl text-transparent" />;
      }

      tr = (
        <tr className="h-14 font-inter font-medium text-xl" key={word.id}>
          <th className="flex justify-center items-center gap-2 border-r-4 border-white">
            {" "}
            {streakIcon}
            {word.word}
          </th>
          <th className="border-r-4 border-white">{word.translation}</th>
          <th className="border-r-4 border-white">
            <WordStatusForm word={word} />
          </th>
          <th className="flex justify-between items-center h-14 p-4">
            <FaTrashAlt
              className="hover:cursor-pointer"
              onClick={() => {
                removeWord({
                  wordToRemove: { word: word, folderID: props.folder.id },
                  userID: user.value,
                }).then(() => {
                  toast.success("Pomyślnie usunięto słówko!");
                }).catch(() => {
                  toast.error("Błąd podczas usuwania słówka!");
                });;
              }}
            />
          </th>
        </tr>
      );
      if (index % 2 === 0) {
        tr = (
          <tr
            className="h-14 bg-fourth font-inter font-medium text-xl"
            key={word.id}
          >
            <th className="flex justify-center items-center gap-2 border-r-4 border-white">
              {" "}
              {streakIcon}
              {word.word}
            </th>
            <th className="border-r-4 border-white">{word.translation}</th>
            <th className="border-r-4 border-white">
              <WordStatusForm word={word} />
            </th>
            <th className="flex justify-between items-center h-14 p-4">
              <FaTrashAlt
                className="hover:cursor-pointer"
                onClick={() => {
                  removeWord({
                    wordToRemove: { word: word, folderID: props.folder.id },
                    userID: user.value,
                  });
                }}
              />
            </th>
          </tr>
        );
      }
      return <>{tr}</>;
    });
    props.setNewID(props.data[props.data.length - 1].id + 1);
  }
  return tr;
};

export default WordRenderer;
