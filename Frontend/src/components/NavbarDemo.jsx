import { BackgroundBeamsDemo } from "./BackgroundBeamsDemo";
import Footer from "./Footer";
import { GlowingEffectDemo } from "./GlowingEffectDemo";
import { HeroScrollDemo } from "./HeroScrollDemo";
import { Link } from "react-router-dom";
import { AppContent } from "../context/AppContex";
import { useContext } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./ui/resizable-navbar";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export function NavbarDemo() {
  const navigate = useNavigate()
  const handlelogout = async(e)=>{
    try{
      e.preventDefault();

      const {data} = await axios.post(backendurl+'/api/auth/logout')

        if(data.success){
          setisLoggedin(false);
          setuserData(false);
          navigate('/')
        }
        else{
          toast.error(data.message)
        }

    }catch(error){
      toast.error(error.message)
    }
  }
  
  const {userData, setuserData, isLoggedin, backendurl, setisLoggedin} = useContext(AppContent)
  const navItems = [
  {
    name: "Room",
    link: "/room",
  },
  {
    name: "Links",
    link: "/links",
  },
  {
    name: "AI Assistant",
    link: "/chat",
  },
  {
    name: "About",
    link: "/about",
  },
  {
    name: "Contact",
    link: "/contact",
  },
  ...(!userData.isAccountVerified && isLoggedin
    ? [
        {
          name: "VerifyEmail",
          link: "/email-verify",
        },
      ]
    : []),
];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar className={""}>
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
              {!isLoggedin && <Link className="px-4 py-2 rounded-md button text-white text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center " to={"/signin"}>
              Login
              </Link>}
              {isLoggedin && <button onClick={handlelogout} className="px-4 py-2 rounded-md button text-white text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center ">
              Logout
              </button>}
              <div
              onClick={()=>{
                window.scrollTo(0, 0);
                navigate('/guest');
              }}
              className="px-4 py-2 rounded-md button bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center">
              Explore
              </div>

          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                to={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-300">
                <span className="block">{item.name}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-4">
              {!isLoggedin && <Link
              to={"/signin"}
                className="px-4 py-2 rounded-md button bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center">
                Login
              </Link>}
              <div
              onClick={()=>{
                window.scrollTo(0, 0);
                navigate('/guest');
              }}
                className="px-4 py-2 rounded-md button bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center"
                >
                Explore
              </div>
              {isLoggedin && <button onClick={handlelogout} className="px-4 py-2 rounded-md button text-white text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center ">
                Logout
              </button>}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
      <div>

      <BackgroundBeamsDemo/>
      <HeroScrollDemo/>
      <GlowingEffectDemo/>
      <Footer/>
      </div>
    </div>
  );
}

