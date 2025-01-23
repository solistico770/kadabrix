import React, { useEffect, useState } from 'react';
import { Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import kdb from '../kadabrix/kadabrix';
import CartComponent from "../kadabrix/cartComponent";
import logo from '../assets/logoTop.png';
import eventBus from '../kadabrix/event';


const Layout = () => {


  eventBus.on("navigate", (payload) => {
    navigate(payload);
  });

  

  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  // BOOFIX

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await kdb.auth.getSession();
      setUser(session?.user || null);
    };

    checkUser();

    const { data: { subscription } } = kdb.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await kdb.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  return (

    <nav className="bg-[#d098f8]/20 h-24 flex items-center relative">
      <div className="w-11/12 mx-auto max-w-[1400px] flex justify-between">
        <img
          onClick={() => navigate('/login')} 
          src={logo}
          className="w-24 cursor-pointer duration-300 hover:scale-105"
          alt=""
        />

        <div className="flex items-center gap-4">



          {user ? (




          <div className="flex items-center gap-4">


              <CartComponent />




              <button
                className="rounded-full outline-none bg-[rgb(208,152,248,0.2)] border border-primary px-7 h-9 font-medium  duration-200 hover:text-white   hover:bg-primary group-hover:shadow-sm "
                onClick={handleLogout}
              >
                יציאה
              </button>
            </div>
          ) : (
            <button
              className="rounded-full outline-none bg-[rgb(208,152,248,0.2)] border border-primary px-7 h-9 font-medium  duration-200 hover:text-white   hover:bg-primary group-hover:shadow-sm "

              color="inherit" onClick={() => navigate('/login')}>
              כניסה
            </button>
          )}




        </div>
      </div>
    </nav>

  );
};

export default Layout;
