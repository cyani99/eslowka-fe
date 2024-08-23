import { FaCalendar, FaInfoCircle } from "react-icons/fa";
import styingSvg from "../shared/img/undraw_studying_re_deca.svg"
import { useNavigate } from "react-router-dom";

const FrontPage = () => {
    const navigate = useNavigate();

    return(
        <div className="flex flex-col h-screen bg-gradient-to-r from-gradient_from to-gradient_to">
            <section>
                <div data-ref="frontpage-nav" className="flex justify-between items-center font-inter h-[100px] px-60">
                    <div className="flex gap-4 text-2xl text-white font-thin">
                        <div>O Nas</div>
                        <div>Premium</div>
                        <div>Wsparcie</div>
                    </div>
                    <div className="text-3xl font-bold text-white">ESŁÓWKA.PL</div>
                    <div className="flex justify-center items-center gap-4">
                        <FaInfoCircle className="text-2xl text-white"/>
                        <FaCalendar className="text-2xl text-white"/>
                        <button className="bg-secondary font-inter text-white font-bold text-xl w-fit px-16 py-2 rounded-xl" type="submit" onClick={()=>{
                    
                    navigate('/login')
                    }}>Zaloguj</button>
                    </div>
                </div>

                <div data-ref="content" className="font-inter flex h-full justify-between items-center gap-28 py-20 px-60">
                    <div data-ref="content-right" className="flex flex-col gap-3 content-left text-white">
                        <div className="font-bold text-2xl">
                            ESŁÓWKA.PL TO FANTASTYCZNY I EKSPRESOWY SPOSÓB NA NAUCZENIE SIĘ SŁOWNICTWA!
                        </div>
                        <div className="font-thin text-lg">
                            Dołącz do tysięcy użytkowników oraz sam decyduj jakich słówek chcesz się uczyć, twórz własne zbiory oraz efektywnie ucz się wybranego języka.
                        </div>
                            <div className="flex gap-6">
                            <button className="bg-secondary font-inter text-white font-bold text-xl w-36 py-2 rounded-xl" onClick={()=>{
                    
                }} type="submit">O Nas</button>
                            <button className="bg-white font-inter text-secondary font-bold text-xl w-36 py-2 rounded-xl" type="submit" onClick={()=>{
                    
                navigate('/signup')
                }}>Rejestracja</button>
                            </div>
                    </div>
                    <div data-ref="content-right">
                        <img src={styingSvg} className="h-1/2" ></img>
                    </div>
                </div>
            </section>
        </div>
    )

}

export default FrontPage;