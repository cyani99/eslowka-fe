import { useState } from "react";
import { Modal } from "../../../shared/components/Modal";
import useModal from "../../../shared/components/Modal/useModal";
import { useSelector } from "react-redux";
import { RootState, useCreateStoryMutation } from "../../../shared/store";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { IStory } from "../../../shared/store/slices/UserSlice";
import { toast } from "react-toastify";
import Button from "../../../shared/components/Button";
import { Colors } from "../../../shared/Enums/Stylings";

interface IModalProps {
    isVisible: boolean;
    onClose: () => void;
    level: string | undefined,
    language: string | undefined,
    allStories: IStory[],
    //add other props if needed
}

function GenerateOwnModal({isVisible, onClose, level,language,allStories}: IModalProps){
  const [storyTitle, setStoryTitle] = useState<string>("");
  const user = useSelector((state: RootState) => state.userProfile);
  const [createStory] = useCreateStoryMutation();
  const [generatedTitle, setGeneratedTitle] = useState<string>("");
  const [generatedWords, setGeneratedWords] = useState<{id: 0, word: string, known: number}[]>([]);
  const [generatedStory, setGeneratedStory] = useState<string>();
  const [generatedDescription, setGeneratedDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const apikey = process.env.REACT_APP_GEMINI_API_KEY;



  //AI stuff
  let genAI;
  if (apikey !== undefined) {
    genAI = new GoogleGenerativeAI(apikey);
  }
  const model = genAI?.getGenerativeModel({
    model: "gemini-1.5-flash-8b",
  });

  if(level === undefined || language === undefined){
    language = "english";
    level = "A1"
  }

  //sets 'translationWord' generated by AI
  const generateStory = async () => {
    let title = "";
    let story = "";
    let description = "";
    let error = false;
    if (model) {
      setIsLoading(true);
      console.log(
        "Czarek właśnie generuje dla Ciebie historie w języku " +
          language +
          " na poziomie " +
          level +
          ":"
      );
      if(storyTitle==""){

      await model
        .generateContent(
          "Generate a compelling and original story title list that captures the essence of a random genre. The title should be between 2-6 words, be memorable, evoke emotion or curiosity, and include at least one strong descriptive word. Consider using elements like alliteration, metaphor, or contrast to make it more engaging. Provide a brief explanation of why this title would appeal to readers of the chosen genre. Titles should be in " +
            level +
            " " +
            language +
            " language. Answer should contain only the titles seperated with comma"
        )
        .then((response) => {
          const responseTitle = response.response;
          title = responseTitle.text().toString();
          let titles = title.split(",");
          console.log(titles);
          title = titles[Math.floor(Math.random() * titles.length)];
          console.log(title);
        })
        .catch((err) => {
          toast.error(
            "Czarek jest obecnie przeciążony. Spróbuj ponownie za chwilę!"
          );
          error = true;
        });


      if (error) return;
    }
    else{
        await model
        .generateContent(
          "translate this title:" + storyTitle + " to "+ language + ". Your answer should contain only the translated title"
        )
        .then((response) => {
          const responseTitle = response.response;
          title = responseTitle.text().toString();
        })
        .catch((err) => {
          toast.error(
            "Czarek jest obecnie przeciążony. Spróbuj ponownie za chwilę!"
          );
          error = true;
        });
    }
      let arraysOfWords: any = [];
      await model
        .generateContent(
          "generate story in " +
            language +
            " language at " +
            level +
            " level. The story will be about " +
            title
        )
        .then((response) => {
          const responseStory = response.response;
          story = responseStory.text().toString();

          //generate story words
          arraysOfWords = story
            .split(/ |\n/)
            .map((word, index) => {
              if (word !== "") {
                const formattedWord = word.replaceAll("\n", "");

                //Check if you already have a word in folder

                return {
                  id: index,
                  word: formattedWord,
                  known: 0,
                };
              }
            })
            .filter((word) => {
              if (word) {
                return true;
              } else {
                return false;
              }
            });

          // Mapa do przechowywania pierwszego id dla każdego unikalnego tytułu
          const titleToId: any = {};

          // Przetwarzanie obiektów, aby ustawić id na takie samo jak pierwsze wystąpienie tytułu
          arraysOfWords.forEach(
            (object: { id: number; word: string; known: number }) => {
              // Jeśli tytuł jeszcze nie ma przypisanego id, przypisz id z pierwszego wystąpienia
              if (titleToId[object.word] === undefined) {
                titleToId[object.word] = object.id;
              } else {
                // Ustaw id na wartość pierwszego wystąpienia
                object.id = titleToId[object.word];
              }
            }
          );

          console.log(arraysOfWords);
        })
        .catch((err) => {
          toast.error(
            "Czarek jest obecnie przeciążony. Spróbuj ponownie za chwilę!"
          );
          error = true;
        });

      if (error) return;
      await model
        .generateContent(
          "generate very short description, in " +
            language +
            " for this story: " +
            story
        )
        .then((response) => {
          const responseDescription = response.response;
          description = responseDescription.text().toString();
          console.log(description);
        })
        .catch((err) => {
          toast.error(
            "Czarek jest obecnie przeciążony. Spróbuj ponownie za chwilę!"
          );
          error = true;
        });

      if (error) return;
      setGeneratedTitle(title);
      setGeneratedStory(story);
      setGeneratedWords(arraysOfWords);
      setGeneratedDescription(description);
      setIsLoading(false);
      setStoryTitle("");
    }
  };

  //On story create
  const onCreateStory = async (newStory: IStory) => {
    return await createStory({ newStory: newStory, userID: user.value })
      .unwrap()
      .then(() => {
        toast.success("Pomyślnie utworzono historie!");
      })
      .catch(() => {
        toast.error("Błąd podczas tworzenia historii!");
      });
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <div className="absolute bg-whiteMain mt-20 z-20 h-2/4 w-full top-0 bg-white rounded xl:w-1/3 xl:left-0 xl:right-0 xl:mr-auto xl:ml-auto">
        <div className="absolute flex flex-col p-8 shrink h-full w-full overflow-y-auto  scrollbar-hide">
          <div className="font-inter font-bold text-3xl text-fifth z-10">
            Generuj własną historię
          </div>

          <div className="flex flex-col gap-2 font-inter ">
            <div className="flex px-4 justify-center items-center pt-2">
              {generatedDescription === "" ? (
                <>
                  {isLoading ? (
                    <div>Ładowanie...</div>
                  ) : (
                    <div className="flex flex-col gap-3 justify-between items-center">
                        <div className="flex flex-col justify-center">
                        <div className="p-1 pl-0">Wpisz tytuł Twojej historii: </div>
                        <div className="p-1 pl-0 text-xs text-fifth">Tytuł może być wpisany w dowolnym języku. Przetłumaczymy go dla Ciebie.</div>
                    <input
                    type="text"
                    placeholder="np. Marta kocha tortille"
                    className="bg-secondarylight rounded-md border border-solid border-main p-1"
                    value={storyTitle}
                    onChange={(e: any) => {
                        setStoryTitle(e.target.value);
                    }}
                  ></input></div>
                     <Button onClick={generateStory} bgColor={Colors.SECONDARY}>
                    Wygeneruj własną historię
                    </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {isLoading ? (
                    <div>Ładowanie...</div>
                  ) : (
                    <div className="flex flex-col gap-1 font-inter">
                      <h1 className="text-xl font-inter font-bold">Podgląd:</h1>
                      <span>Tytuł:{generatedTitle}</span>
                      <span>Opis:{generatedDescription}</span>
                      <span>Poziom: {level}, Język: {language}</span>
                      <input
                    type="text"
                    className="bg-secondarylight rounded-md border border-solid border-main p-1"
                    value={storyTitle}
                    onChange={(e: any) => {
                        setStoryTitle(e.target.value);
                    }}
                  ></input>
                      <Button
                        onClick={generateStory}
                        bgColor={Colors.SECONDARY}
                      >
                        Wygeneruj ponownie
                      </Button>
                      <Button
                        onClick={() => {
                          let newID = 0;
                          console.log(allStories);
                          if (allStories.length > 0) {
                            newID = allStories[allStories.length - 1].id + 1;
                          }
                          if(level === undefined || language === undefined){
                            language = "english";
                            level = "A1"
                          }
                          onCreateStory({
                            id: newID,
                            description: generatedDescription,
                            language: language,
                            level: level,
                            title: generatedTitle,
                            words: generatedWords,
                            wordAmount: 0,
                            wordKnownAmount: 0,
                          });
                          setGeneratedDescription("");
                          setGeneratedStory("");
                          setGeneratedTitle("");
                          onClose();
                        }}
                        bgColor={Colors.SECONDARY}
                      >
                        Dodaj do kolekcji
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default GenerateOwnModal;