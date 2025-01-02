import { useEffect } from "react";
import { useUpdateFolderDefaultVoiceMutation, useUpdateFolderSecondaryVoiceMutation } from "../../../../shared/store";
import { useDispatch } from "react-redux";
import { change, IFolder } from "../../../../shared/store/slices/FolderSlice";

interface IProps{
    defaultVoice: boolean;
    selectedVoice: string;
    userID: string;
    folder: IFolder;
    setVoice?: (voice:SpeechSynthesisVoice)=>void;
}


/**
 * LanguageSelector is a React component that allows users to select a voice for text-to-speech functionality.
 * It displays a dropdown menu with available voices and updates the selected voice when the user makes a choice.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.default - Indicates whether this is the default language selector.
 * @returns {JSX.Element} A div containing a label and a select element for voice selection.
 */
function LanguageSelector({defaultVoice, selectedVoice,userID,folder,setVoice}:IProps){
    const [updateDefaultVoice] = useUpdateFolderDefaultVoiceMutation();
    const [updateSecondaryVoice] = useUpdateFolderSecondaryVoiceMutation();
    const dispatch = useDispatch();


    useEffect(() => {
        const synth = window.speechSynthesis;
        const voices = synth.getVoices();
        const yourVoice = voices.find((v) => v.name === selectedVoice);
        if(setVoice){
          if(yourVoice){
            setVoice(yourVoice);
          }
        }
        else{
          console.log("Nie znaleziono głosu!")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const handleVoiceChange = async (event: any) => {
      const voices = window.speechSynthesis.getVoices();

      const yourVoice = voices.find((v) => v.name === event.target.value);
      if(yourVoice) {
      if (defaultVoice) {
        await updateDefaultVoice({
          voice: yourVoice.name,
          userID: userID,
          folderID: folder.id,
        }).then((voice) => {
          console.log(voice)
          folder = {...folder, defaultVoice: yourVoice.name}
          dispatch(change(folder));
          if(setVoice){
            setVoice(yourVoice);
          }
        }).catch((error) => {        console.log(error);  }

      );
      } else if(!defaultVoice) {
        await updateSecondaryVoice({
          voice: yourVoice.name,
          userID: userID,
          folderID: folder.id,
        }).then((voice) => {
          console.log(voice)
          folder = {...folder, defaultVoiceReversed: yourVoice.name}
          dispatch(change(folder));
          if(setVoice){
            setVoice(yourVoice);
          }
        }).catch((error) => {        console.log(error);  })
      }
      }
    };
    

    return(
        <div className="flex flex-row justify-center items-center">
        <select className="text-xs border w-64" value={selectedVoice} onChange={handleVoiceChange}>
          {window.speechSynthesis.getVoices().map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
        </div>
    )
}

export default LanguageSelector;