//ICONS & SVG
import { HiPlus } from "react-icons/hi";
import { IoMdArrowRoundBack } from "react-icons/io";
import character1 from "../../../shared/img/character1.svg";

import { RootState, useGetAllWordsInFolderQuery, useUpdateFolderNameMutation } from "../../../shared/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../shared/components/Modal";
import { useEffect, useState } from "react";
import StatusBox from "../../../shared/components/StatusBox";
import Character from "../../../shared/components/Character";
import AddWordsModal from "./Components/AddWordsModal";
import WordRenderer, { WordsTable } from "./Components/WordRenderer";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import UpdateWordsModal from "./Components/UpdateWordsModal";
import { IWord } from "../../../shared/store/slices/FolderSlice";
import { CSVLink } from "react-csv";
import CsvFileInput from "../../../shared/components/CsvFileInput";
import ImportWordsModal from "./Components/ImportWordsModal";
import FirstTitle from "../../../shared/components/FirstTitle";
import { motion } from "framer-motion";
import LanguageSelector from "../TrainingsPageview/Components/LanguageSelector";
import { FaCopy } from "react-icons/fa";
import EditableText from "../../../shared/components/EditableText";

const WordsInFolderPage = () => {
  const { isVisible, toggleModal, closeModal } = useModal();
  const updateModal = useModal();
  const importModal = useModal();
  const [newID, setNewID] = useState(0);
  const navigate = useNavigate();
  const folder = useSelector((state: RootState) => state.folderProfile);
  const [currentWord, setCurrentWord] = useState<IWord>();
  const [page, setPage] = useState(1);
  const user = useSelector((state: RootState) => state.userProfile);
  const response = useGetAllWordsInFolderQuery({
    folderID: folder.id,
    userID: user.value,
  });
  const [renameFolder] = useUpdateFolderNameMutation();
  const [copied, setCopied] = useState(false);

  let renderedWords;
  let availablePages = 0;
  let resultArray = [];
  useEffect(() => {
    if (folder.words === undefined) {
      navigate("/app/folders");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //LOADING THE TABLE
  if (response.isLoading) {
    renderedWords = <div>Ładowanie...</div>;
  } else if (response.isError) {
    renderedWords = <div>Error</div>;
    navigate("/app/folders");
  } else if (response.isSuccess) {
    //CALCULATE DATA PER PAGE
    let responseDataLength = 0;
    let allWords = response.data;
    resultArray = Object.keys(response.data).map(function(personNamedIndex){
      let person = response.data[personNamedIndex];
      // do something with person
      return person;
  });
    if (response !== undefined) {
      responseDataLength = response.data.length;
    }
    availablePages = responseDataLength / 12;
    availablePages = ~~availablePages + 1;

    let wordsData;
    wordsData = response.data.slice(12 * (page - 1), 12 * page - 1+1);

    renderedWords = (
      <WordRenderer
        setCurrentWord={setCurrentWord}
        data={wordsData}
        allWords={allWords}
        folder={folder}
        setNewID={setNewID}
        openUpdateModal={updateModal.toggleModal}
      />
    );
  }

  let pageArrows = <></>;
  if (availablePages > 1) {
    pageArrows = (
      <>
        <div className="flex justify-center items-center text-base text-fifth">
          Strona {page}/{availablePages}
        </div>
        <div
          onClick={() => {
            if (page > 1) {
              setPage(page - 1);
            }
          }}
          className="flex items-center bg-secondary rounded-xl p-2 hover:cursor-pointer hover:bg-secondarylight"
        >
          <FaAngleLeft />
        </div>
        <div
          onClick={() => {
            if (page < availablePages) setPage(page + 1);
          }}
          className="flex items-center bg-secondary rounded-xl p-2 hover:cursor-pointer hover:bg-secondarylight"
        >
          <FaAngleRight />
        </div>
      </>
    );
  }
  let folderLength = 1;
  if (folder.words !== undefined) {
    folderLength = folder.words.length;
  }
  const wordAmount = folderLength;

  const [data, setData] = useState([]);
  const handleFileLoad = (csvData:any) => {
    setData(csvData);
    importModal.toggleModal();
  };

  const handleFolderNameChange = (newName:string) => {
    renameFolder({newName: newName, userID: user.value, folderID: folder.id})
  }

  const handleFolderIDCopy = () => {
    navigator.clipboard.writeText(folder.referenceID)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
      })
      .catch((err) => console.error("Failed to copy text: ", err));
  };

  return (
    <>
      <div className="flex flex-col size-full">
      <FirstTitle>Foldery - {folder.folderName}</FirstTitle>
        <div
          className="flex px-4 gap-4 h-20 max-lg:w-full items-center max-lg:justify-center
                            text-black text-3xl font-medium"
        >
          <div className="flex justify-center items-center gap-2 max-lg:hidden">
            <EditableText initialText={folder.folderName} onConfirm={handleFolderNameChange}/>
            <div className="text-xs text-fifth">({wordAmount} słówek)</div>
          </div>
          <div className="flex gap-4">
            {pageArrows}
            <div
              onClick={() => {
                toggleModal();
              }}
              className="flex items-center bg-secondary rounded-xl p-2 hover:cursor-pointer hover:bg-secondarylight"
            >
              <HiPlus />
              <div className="text-lg">Nowe Słówko </div>
            </div>
            <div
              onClick={() => {
                navigate("/app/folders");
              }}
              className="flex items-center bg-secondary rounded-xl p-2 hover:cursor-pointer hover:bg-secondarylight"
            >
              <IoMdArrowRoundBack className="max-lg:hidden" />
              <div className="text-lg">Powrót </div>
            </div>
            <div onClick={()=>{
              handleFolderIDCopy();
            }}
              className="flex gap-2 items-center p-2 hover:cursor-pointer hover:bg-secondarylight text-fifth rounded-lg"
            >
              {copied ? (<div className="text-sm font-inter">Skopiowane!</div>) : (    <><div className="flex text-sm gap-1 justify-center items-center">
                


                <label>Udostępnij </label>
                <FaCopy className="max-lg:hidden text-base" />
                <label>:</label>
                </div>
                <div className="text-sm">{folder.referenceID} </div></>
              )}
          
              
            </div>
          </div>
        </div>
        <div
          className="flex pl-4 max-lg:pr-4 items-left
                            text-black text-3xl font-medium"
        >
          <div className="flex flex-col h-auto w-3/4 max-lg:w-full shadow-lg justify-start">
            <WordsTable renderedWords={renderedWords} />
          </div>
          <div className="flex flex-col w-1/3 max-lg:hidden gap-2">
            <StatusBox />
            <CSVLink
              className="flex p-2 justify-center font-bold items-center shadow-lg mx-2 rounded-xl text-sm font-inter bg-white z-10 hover:bg-secondarylight  border-secondary border-y-2 border-x-2 max-lg:hidden"
              data={resultArray}
              filename={"eslowka-eksport.csv"}
            >
              Eksport Słówek
            </CSVLink>
            <CsvFileInput onFileLoad={handleFileLoad} />
            <div className="flex flex-col gap-2 p-2 justify-center font-bold items-center shadow-lg mx-2 rounded-xl text-sm font-inter bg-white z-10  border-secondary border-y-2 border-x-2 max-lg:hidden">
              <label className="text-sm">Domyślny głos dla kolumny "Słowo":</label>
              <LanguageSelector
                defaultVoice={true}
                selectedVoice={folder.defaultVoice}
                userID={user.value}
                folder={folder}/>
            </div>
            <div className="flex flex-col gap-2 p-2 justify-center font-bold items-center shadow-lg mx-2 rounded-xl text-sm font-inter bg-white z-10  border-secondary border-y-2 border-x-2 max-lg:hidden">
              <label className="text-sm">Domyślny głos dla kolumny "Tłumaczenie":</label>
              <LanguageSelector
                defaultVoice={false}
                selectedVoice={folder.defaultVoiceReversed}
                userID={user.value}
                folder={folder}/>
            </div>
          </div>
        </div>

        <motion.div whileHover={{ scale: [null, 1.5, 1.4] }}
      transition={{ duration: 0.3 }}
          onClick={() => {
            toggleModal();
          }}
          className="flex z-10 absolute bottom-0 right-0 m-8 h-16 w-16 bg-secondary hover:bg-third hover:cursor-pointer rounded-full shadow-md items-center justify-center"
        >
          <HiPlus className="text-2xl" />
        </motion.div>
      </div>
      <Character
        alt="character1"
        className="absolute z-0 w-1/5 bottom-0 right-0 max-lg:hidden"
        character={character1}
      />
      <ImportWordsModal
        isVisible={importModal.isVisible}
        closeModal={importModal.closeModal}
        folder={response.data}
        data={data}
        />
      <AddWordsModal
        isVisible={isVisible}
        closeModal={closeModal}
        folder={folder}
        newID={newID}
      />
      <UpdateWordsModal
        currentWord={currentWord}
        isVisible={updateModal.isVisible}
        closeModal={updateModal.closeModal}
        folder={folder}
        newID={0}
      />
    </>
  );
};

export default WordsInFolderPage;
