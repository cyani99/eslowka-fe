import { BiSolidExit } from "react-icons/bi";
import { Modal } from "../../../../shared/components/Modal";
import { useRemoveFolderMutation } from "../../../../shared/store";
import { IFolder } from "../../../../shared/store/slices/FolderSlice";
import { FC } from "react";

const RemoveConfirmModal: FC<{isVisible: boolean, closeModal: () => void, folder: IFolder | undefined, userID: string}> = (props): JSX.Element => {
    const [removeFolder] = useRemoveFolderMutation();
    let folderToRemove: IFolder;
    if(props.folder !== undefined){
        folderToRemove = props.folder;
    }
    return (
        <Modal
        onClose={props.closeModal}
        isVisible={props.isVisible}
      >
        <div className="absolute bg-whiteMain mt-20 z-20 h-1/4 w-full top-0 bg-white rounded xl:w-1/3 xl:left-0 xl:right-0 xl:mr-auto xl:ml-auto">
          <div className="absolute flex flex-col p-8 shrink h-full w-full overflow-y-auto  scrollbar-hide z-10">
            <form className="z-10">
              <div className="font-inter font-bold text-2xl text-fifth z-10 truncate">
                Czy na pewno chcesz usunąć?
              </div>
              <div className="flex p-9 px-44 justify-between items-center">
              <button onClick={()=>{
                  removeFolder({folderToRemove: folderToRemove, userID: props.userID});
                  props.closeModal();
              }} className="bg-secondary p-4 px-6 text-xl font-bold font-inter rounded-xl">TAK</button>
              <button className="bg-secondary p-4 px-6 text-xl font-bold font-inter rounded-xl">NIE</button>
              </div>

            </form>
            <div className="absolute top-0 right-0 pr-8 pt-6 text-3xl z-20 text-fifth ">
              <BiSolidExit
                className="hover:text-4xl hover:cursor-pointer"
                onClick={props.closeModal}
              />
            </div>
          </div>
        </div>
      </Modal>
    )

}

export default RemoveConfirmModal;