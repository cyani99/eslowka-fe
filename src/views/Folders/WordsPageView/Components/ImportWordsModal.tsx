import { FC } from "react"
import { IFolder, INewWords, IWord } from "../../../../shared/store/slices/FolderSlice"
import { Modal } from "../../../../shared/components/Modal"
import { RootState, useCreateWordsMutation } from "../../../../shared/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Button from "../../../../shared/components/Button";
import { Colors } from "../../../../shared/Enums/Stylings";


const ImportWordsModal: FC<{isVisible: boolean, closeModal: () => void, folder: IWord[], data: any}> = (props): JSX.Element => {
    const [createWords] = useCreateWordsMutation();
    const user = useSelector((state: RootState) => state.userProfile);
    const navigate = useNavigate();
    const onWordsCreate = async (newWords: INewWords) => {
        //UPDATE FOLDER - ADD WORDS IN DB
        return await createWords({newWords:newWords, userID: user.value})
          .unwrap()
          .then((res) => {
            toast.success("Pomyślnie zaimportowano słówka!");
            navigate('/app')
          })
          .catch((err) => {
            toast.error("Problem podczas importu!");
          });
      };

    const ImportWords = async () =>{
        console.log(props.folder)
        const folderWords = props.folder;
        const dataToAdd :IWord[]= props.data;
        if (
          props.data[0].hasOwnProperty("id") ||
          props.data[0].hasOwnProperty("word") ||
          props.data[0].hasOwnProperty("translation") ||
          props.data[0].hasOwnProperty("streak") ||
          props.data[0].hasOwnProperty("known") ||
          props.data[0].hasOwnProperty("folderId") ||
          props.data[0].hasOwnProperty("repeated")
        ) {
          if (folderWords !== undefined) {
            if (folderWords.length !== 0) {
              const currentWordsIDs = folderWords.map(
                (word: IWord, index: number) => {
                  return word.id;
                }
              );
              console.log(currentWordsIDs);
              console.log(currentWordsIDs[currentWordsIDs.length - 1]);

              const dataToAddWithNewIDs = dataToAdd.map(
                (word: IWord, index: number) => {
                  word.id =
                    currentWordsIDs[currentWordsIDs.length - 1] + (index + 1);
                  console.log("NEWID", word.id);
                  word.folderId = folderWords[0].folderId;
                  return word;
                }
              );
              await onWordsCreate({
                words: dataToAddWithNewIDs,
                folderID: folderWords[0].folderId,
              });
            }
          }
        }
        else{
            toast.error("Zły format importu!");
            props.closeModal();
        }
            


        console.log("CURRENT DATA",folderWords);
        console.log("DATA TO ADD",dataToAdd);


    }


return (
    <Modal isVisible={props.isVisible} onClose={props.closeModal}>
    <div className="absolute bg-whiteMain mt-20 z-20 h-1/4 w-full top-0 bg-white rounded xl:w-1/3 xl:left-0 xl:right-0 xl:mr-auto xl:ml-auto">
      <div className="font-inter p-8 text-center">Znaleziono {props.data.length} słówek, gotowych do zaimporotwania</div>
      <div className="font-inter p-4 text-center font-bold">Chcesz je teraz zaimportować?</div>
      <div className="absolute flex flex-col p-8 shrink h-full w-full overflow-y-auto scrollbar-hide z-10">
            <form className="flex gap-2 justify-between">
                <Button bgColor={Colors.SECONDARY} onClick={(e)=>{
                    e.preventDefault();
                    ImportWords();
                }}>TAK</Button>
                <Button bgColor={Colors.SECONDARY} onClick={()=>{props.closeModal()}}>NIE</Button>
            </form>
      </div>
    </div>
    </Modal>
)}

export default ImportWordsModal;