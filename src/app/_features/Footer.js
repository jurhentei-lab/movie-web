import VectorWhite from "../_icons/VectorWhiteIcon";
import Email from "../_icons/EmailIcon";
import Phone from "../_icons/PhoneIcon";

function Footer() {
  return (
    <footer className="w-full bg-[#4338CA] py-10">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-4 md:flex-row md:justify-between">
        <div className="flex flex-col gap-4">
          <div className="w-[92px]">
            <VectorWhite />
          </div>
          <p className="font-inter text-[14px] leading-[20px] text-[#FAFAFA]">
            © 2024 Movie Z. All Rights Reserved.
          </p>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:gap-16">
          <div className="flex flex-col gap-3">
            <p className="font-inter text-[14px] text-[#FAFAFA]">
              Contact Information
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex gap-3 items-center">
                <Email />
                <div>
                  <p className="font-inter font-medium text-[14px] text-[#FAFAFA]">
                    Email:
                  </p>
                  <p className="font-inter font-medium text-[14px] text-[#FAFAFA]">
                    support@movieZ.com
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <Phone />
                <div>
                  <p className="font-inter font-medium text-[14px] text-[#FAFAFA]">
                    Phone:
                  </p>
                  <p className="font-inter font-medium text-[14px] text-[#FAFAFA]">
                    +976 (11) 123-4567
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-inter text-[14px] text-[#FAFAFA]">Follow us</p>
            <div className="flex flex-wrap gap-3">
              <p className="font-inter font-medium text-[14px] text-[#FAFAFA]">
                Facebook
              </p>
              <p className="font-inter font-medium text-[14px] text-[#FAFAFA]">
                Instagram
              </p>
              <p className="font-inter font-medium text-[14px] text-[#FAFAFA]">
                Twitter
              </p>
              <p className="font-inter font-medium text-[14px] text-[#FAFAFA]">
                Youtube
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
