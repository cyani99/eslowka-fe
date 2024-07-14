import character1 from "../../shared/img/character1.svg";
import { HiPlus } from "react-icons/hi";
import { TbFolderFilled } from "react-icons/tb";
import { RootState, useFetchFoldersQuery } from "../../shared/store";
import { IFolder } from "../../shared/store/slices/FolderSlice";
import { useDispatch, useSelector } from "react-redux";
import {change} from "../../shared/store/slices/FolderSlice"
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaPlayCircle } from "react-icons/fa";
import useModal from "../../shared/components/Modal/useModal";
import { Modal } from "../../shared/components/Modal";

const FoldersPage = () => {
  const {isVisible, closeModal, toggleModal} = useModal();
  const response = useFetchFoldersQuery("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const folderProfile = useSelector((state: RootState) => state.folderProfile);

  let renderedFolders;
  if (response.isLoading) {
    renderedFolders = <div>Ładowanie...</div>;
  } else if (response.isError) {
    renderedFolders = <div>Error</div>;
  } else if (response.isSuccess) {
    renderedFolders = response.data.map((folder: IFolder, index: number) => {
      console.log(folderProfile.id)
      return (
        <div
          className="flex flex-col pl-4 mb-2 items-left
                text-black text-3xl font-medium"
        >
          <div className="flex flex-col w-3/4 justify-center">
            <div className="flex items-center justify-between p-2 bg-fourth rounded-lg shadow-lg  hover:bg-secondarylight">
              <div onClick={()=>{
                  dispatch(change(folder));
                  navigate('/folders/words');
              }} className="flex items-center gap-4 hover:cursor-pointer">
                <TbFolderFilled className="bg-main text-white rounded-md" />
                <div  className="text-xl">{folder.folderName}</div>
                <div className="text-xs text-fifth">(Słówka:{folder.words.length})</div>
              </div>
              <div className="flex gap-4 mr-4">
                <div className="flex items-center">
                  <div className="text-fifth font-inter font-medium text-base">Progress:</div>
                  <div className="text-red-600 font-inter font-medium text-base">0%</div>
                </div>
                <div onClick={() => {
                  dispatch(change(folder));
                  navigate('/folders/words');
                  }} className="flex flex-col gap-1 text-fifth hover:cursor-pointer hover:text-main font-inter items-center">
                  <FaEdit className="text-lg"/>
                  <div className="text-xs">Edytuj</div>
                </div>
                <div className="flex flex-col gap-1 text-fifth hover:cursor-pointer hover:text-main font-inter items-center">
                  <FaPlayCircle className="text-lg"/>
                  <div className="text-xs">Ćwicz</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      );
    });
  }

  return (
    <>
      <div className="flex flex-col w-full h-full">
        <div
          className="flex pl-4 bg-fourth h-8  items-center
                            text-fifth text-sm font-medium"
        >
          Foldery
        </div>
        <div
          className="flex pl-4 h-20 items-center
                            text-black text-3xl font-medium"
        >
          Twoje Foldery
        </div>
        {renderedFolders}
        <div onClick={()=>{
          toggleModal();
        }} className="flex z-10 absolute bottom-0 right-0 m-8 h-16 w-16 bg-secondary hover:bg-third hover:cursor-pointer rounded-full shadow-md items-center justify-center">
          <HiPlus className="text-2xl" />
        </div>
      </div>
      <img
        alt="character1"
        className="absolute z-0 w-1/5 bottom-0 right-0"
        src={character1}
      ></img>
            <Modal isVisible={isVisible} onClose={closeModal}>
        <div className="absolute bg-whiteMain mt-20 z-20 h-3/4 w-full top-0 bg-white rounded xl:w-1/3 xl:left-0 xl:right-0 xl:mr-auto xl:ml-auto">
          <div className="absolute flex flex-col justify-between p-8 shrink h-full w-full overflow-y-auto  scrollbar-hide">

          </div>
        </div>
      </Modal>
    </>
  );
};

export default FoldersPage;
