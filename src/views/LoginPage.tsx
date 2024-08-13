import { useFormik } from "formik";
import {doSignInWithEmailAndPassword } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { HiMail } from "react-icons/hi";
import loginPageSvg from "../shared/img/loginPage.svg"
import Character from "../shared/components/Character";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      doSignInWithEmailAndPassword(values.email, values.password).then(()=>{
        toast.success("Pomyślnie zalogowano! Zostaniesz przekierowany!");
        setTimeout(() => {
          navigate("/app");
        }, 2500);
      }).catch((err)=>{
        console.log(err);
        toast.error("Błedny login lub hasło!");
      });
      //CREATE USER IN MONGODB
    },
  });

  return (
    <>
    <div className="flex flex-col h-screen items-center justify-center bg-gradient-to-r from-gradient_from to-gradient_to">
      <section className="flex relative rounded-3xl min-h-[42rem] min-w-[80rem] bg-white shadow-lg">
        <div className="flex flex-col gap-5 p-4 w-1/2 h-full justify-center items-center rounded-tl-3xl rounded-bl-3xl z-20">
          <div className="font-inter font-bold text-[54px]">Zaloguj się!</div>
          <div className="flex flex-row gap-4 text-[42px] text-fifth">
            <div className="border border-black rounded-xl p-2"><HiMail/></div>
            <div className="border border-black rounded-xl p-2"><HiMail/></div>
            <div className="border border-black rounded-xl p-2"><HiMail/></div>
            <div className="border border-black rounded-xl p-2"><HiMail/></div>
          </div>
          <form className="flex flex-col gap-3" onSubmit={formik.handleSubmit}>
            <div className="flex justify-center items-center font-inter text-fifth font-bold">Wprowadź swoje dane!</div>
            <div className="flex flex-col gap-4">
            <input
              className="bg-fifth_light h-10 rounded-md p-3 w-[20rem]"
              id="email"
              name="email"
              type="email"
              placeholder="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <input
              className="bg-fifth_light h-10 rounded-md p-3"
              id="password"
              name="password"
              type="password"
              placeholder="hasło"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            </div>
            <div className="flex justify-center items-center font-inter text-fifth font-bold underline">Nie pamiętasz hasła?</div>
            <div className="flex justify-center items-center">
              <button className="bg-secondary font-inter text-white font-bold text-xl w-fit px-16 py-2 rounded-xl" type="submit">Zaloguj</button>
            </div>
          </form>
        </div>
        <div className="flex flex-col z-0 gap-5 p-4 w-1/2 justify-center items-center bg-secondary rounded-tr-3xl rounded-br-3xl rounded-tl-login_screen rounded-bl-login_screen">
          <div className="font-inter font-bold z-20 text-[54px] text-white">Witaj, przybyszu!</div>
          <div className="flex justify-center z-20 items-center font-inter text-lg text-white font-medium">Chciałbyś nauczyć się nowych słówek, ale nie wiesz jak zacząć?</div>
          <button onClick={()=>{
            navigate('/signup')
          }} className="bg-secondary z-20 font-inter text-white font-bold text-xl w-fit mt-8 px-16 py-3 rounded-2xl  border-white border-x-[5px] border-y-[5px]" type="submit">Dołącz do nas!</button>
        </div>
        <Character alt="LoginPage character" className="absolute z-10 bottom-0 left-1/3 h-[30rem] select-none" character={loginPageSvg}/>
      </section>
    </div>
    <ToastContainer
        position="bottom-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
    </>
  );
}

export default LoginPage;

