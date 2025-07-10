import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

import toast, { Toaster } from "react-hot-toast";
import Loder from "./Loder";
const GuestWithId = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/file/get-file",
          { params: { id } }
        );
        if (response.data.success === false) {
          toast.error(response.data.message);
          await new Promise((resolve) => setTimeout(resolve, 500));
          navigate("/notfound", {replace: true});
          return;
        }
        sessionStorage.setItem("lang", response.data.file.lang);
        sessionStorage.setItem("code", response.data.file.code);
        const key = localStorage.getItem("key12390");
        if (key === null) {
          navigate("/guest", {
            state: {
              haveid: false,
              slink: `https://pixelcode-nine.vercel.app/guest/`,
            },
          });
        } else {
          localStorage.removeItem("key12390");
          navigate("/guest", {
            state: {
              haveid: true,
              slink: `https://pixelcode-nine.vercel.app/guest/${id}`,
            },
          });
        }
      } catch (error) {
        console.error("Fetch failed", error);
        navigate("/notfound", {replace: true});
        toast.error("Some error occurred");
      }
    };

    fetchData();
  }, [id, navigate]);
  return (
    <>
      hello
      <Loder />
    </>
  );
};

export default GuestWithId;
