import React from "react";

import banner from "../../assets/images/footer_banner.png";

function Footer({ toggle }) {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer>
        <div className="w-full mt-auto relative">
          <img src={banner} alt="Banner" className="w-full opacity-60" />
          <div className="absolute bottom-0 left-0 w-full text-center text-black text-sm p-2">
            © Bản quyền thuộc về AgriPro, {currentYear}.
          </div>
        </div>
      </footer>
    </> 
  );
}

export default Footer;
