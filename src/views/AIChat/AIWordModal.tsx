import { useSelector } from "react-redux";
import { Modal } from "../../shared/components/Modal";
import { RootState, useCreateWordInFolderMutation, useGetUserFoldersQuery } from "../../shared/store";
import { IFolder, INewWord } from "../../shared/store/slices/FolderSlice";
import { useEffect, useState } from "react";
import { GoogleGenerativeAI} from "@google/generative-ai";
import FolderSelector from "./FolderSelector";
import { toast } from "react-toastify";
import Button from "../../shared/components/Button";
import { Colors } from "../../shared/Enums/Stylings";

interface IProps {
  //is modal visible or not?
  isVisible: boolean;
  //on Modal close
  onClose: () => void;
  //selected word
  word: string;
}

function AIWordModal({ isVisible, onClose, word}: IProps) {
   //current loged user
   const user = useSelector((state: RootState) => state.userProfile);
   //response from api getting all folders
   const response = useGetUserFoldersQuery(user.value);
   //folder from selector
   const [folder, setFolder] = useState<any>();
   //word which user wants to add to folder, formatted as clear word
   const selectedWord = word.replaceAll(",","").replaceAll(")","").replaceAll("(","").replaceAll(".","").replaceAll("?","").replaceAll("!","").replaceAll(`"`,"").replaceAll("`","").replaceAll("'","").replaceAll(":","");
   //word which user wants to add to folder, may be modified by user before adding
   const [formatedWord, setFormatedWord] = useState<string>(selectedWord)
   //word translation from AI or modified by user
   const [translationWord, setTranslationWord] = useState<string>("");
   //createWord api mutation
   const [createWord] = useCreateWordInFolderMutation();
   //setter checks if word translation is already generated by AI
   const [generatedWord,setGeneratedWord] = useState(false);
   //check if AI generation is loading
   const [isLoading, setIsLoading] = useState(false);

  // gemini api key
  const apikey = process.env.REACT_APP_GEMINI_API_KEY;

  //resets the states when user click new word from chat
  useEffect(()=>{
    setTranslationWord("");
    setFormatedWord(selectedWord);
    setGeneratedWord(false);

  },[selectedWord])

   //AI stuff
   let genAI;
   if (apikey !== undefined) {
     genAI = new GoogleGenerativeAI(apikey);
   }
   const model = genAI?.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
  });

  //sets 'translationWord' generated by AI
  const setTranslation = async (word: string) => {
    if(isLoading){
      toast.error("Generowanie danych jest w toku...");
      return;
    }

    setIsLoading(true);
    let translation = "";
    if(model){
      const countResult = await model.countTokens(
        "Przetłumacz słowo:" +
          word +
          " i zapisz tłumaczenie tylko jednym słowem"
      );

      console.log(countResult.totalTokens);
      if (countResult !== undefined) {
        if (countResult.totalTokens > 850) {
          toast.error("Przekroczono ilość tokenów!");
          return;
        }
      }
      
            
      const result = await model.generateContent("Przetłumacz słowo:"+word+" i zapisz tłumaczenie tylko jednym słowem");
      const response = await result.response;
      translation = response.text().toString();
      console.log(word);
      setTranslationWord(translation);
      setGeneratedWord(true);
      setIsLoading(false);
    }
  }

  //ADD THIS WORD TO CURRENT SELECTED FOLDER
  const AddWordToFolder = async () => {
    console.log(folder);
    if(folder){
    let newID = 0;
    if(folder.words.length !== 0 ){
      console.log("długosc",folder.words.length)
      console.log("poprzednie id",folder.words[folder.words.length - 1].id)
      newID = (folder.words[folder.words.length - 1].id + 1)
    }
    console.log("NOWE ID",newID);

    //to eliminate bug with /n in word
    const wordTranslation = translationWord.toString().replaceAll('\n','')
    const wordMain = formatedWord.toString().replaceAll('\n','')
    //create new word object
    const word:INewWord = {
      word: {
        id:newID,
        folderId: folder.id,
        word: wordMain,
        translation: wordTranslation,
        repeated: 0,
        known: 0,
        streak: 0,
        reverseStreak: 0,
        note: "",
      },
      folderID: folder.id,
    }


    return await createWord({newWord:word, userID: user.value})
    .unwrap()
    .then((res) => {
      toast.success("Pomyślnie dodano słówko do folderu!");
      setTranslationWord("");
      setFormatedWord(selectedWord);
      setGeneratedWord(false);
      onClose();
    })
    .catch((err) => {
      toast.success("Błąd podczas dodawania słówka do folderu!");
    });
  }
  }

  //FOLDER SELECTOR list of folders
  let options = [{value:"Ładowanie...", label: "Ładowanie..."}];
  if(response.isSuccess) {
    options = response.data.map((folder: IFolder) => ({ value: folder.folderName, label: folder.folderName }));
  } 
  
  ////////////////////////////////
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <div className="absolute bg-whiteMain mt-20 z-20 h-2/4 w-full top-0 bg-white rounded xl:w-1/3 xl:left-0 xl:right-0 xl:mr-auto xl:ml-auto">
        <div className="absolute flex flex-col p-8 shrink h-full w-full overflow-y-auto  scrollbar-hide">
          <div className="font-inter font-bold text-3xl text-fifth z-10">
            Słówko
          </div>

          <div className="flex flex-col gap-2 font-inter ">
            <div className="flex gap-2">
            <div className="p-1 pl-0">Sugerowane tłumaczenie: </div>
              <input
                type="text"
                className="bg-secondarylight rounded-md border border-solid border-main p-1"
                value={formatedWord}
                onChange={(e: any) => {
                  setFormatedWord(e.target.value);
                }}
              ></input>
            </div>
            <div className="flex gap-2">
              <div className="p-1 pl-0">Sugerowane tłumaczenie: </div>
              <input
                type="text"
                className="bg-secondarylight rounded-md border border-solid border-main p-1"
                value={translationWord}
                onChange={(e: any) => {
                  setTranslationWord(e.target.value);
                }}
              ></input>
            </div>

            <FolderSelector
              userID={user.value}
              options={options}
              text="Wybierz folder docelowy:"
              setFolder={setFolder}
            />
            {generatedWord ? (
              <div className="flex gap-2">
              <Button bgColor={Colors.SECONDARY} onClick={()=>{
              setTranslation(formatedWord);
              }}>
                Wygeneruj Ponownie
              </Button>
              <Button bgColor={Colors.SECONDARY} onClick={()=>{
                AddWordToFolder()
              }}>
                Dodaj do wybranego folderu
              </Button></div>
            ) : (
              <Button bgColor={Colors.SECONDARY} onClick={()=>{
                setTranslation(formatedWord);
                }}>
                Wygeneruj Tłumaczenie
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default AIWordModal;
