import React from "react";
import InputField from "./InputField.tsx";
import { InputFieldProps } from "./InputField.tsx";

const inputFields: InputFieldProps[] = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/5e4309baef3d2af2977ec1773539c0dcb0572b4ec9ff64992b126b5ed3e5b096?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973",
    placeholder: "Enter First Name",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/3653da93271e829d7636ca6522b726ffee6fb23d2a6c4141f0199e5bb29283fa?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973",
    placeholder: "Enter Last Name",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/15d9d66e40d4413714f1da94d6a947393f897f32b6ce93cc93a1255ce0f884b0?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973",
    placeholder: "Enter Username",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/b1826b734ac4f99004eb1de8a224fbbf84fadd484946e94b9178071c72db3dd9?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973",
    placeholder: "Enter Email",
    type: "email",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/fba362c52534463268eb1b0506a448f33d44fab0af22ddf1dc75652a29e8b175?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973",
    placeholder: "Enter Password",
    type: "password",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/10da031f475921947e60196653cd202b7aecd9dc997cca5b803cd171f9f122dd?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973",
    placeholder: "Confirm Password",
    type: "password",
  },
];

const RegisterForm: React.FC = () => {
  return (
    <main className="flex overflow-hidden flex-col text-base font-medium bg-teal-300 text-neutral-400">
      <section className="flex relative flex-col justify-center items-center px-16 py-32 w-full min-h-[1024px] max-md:px-5 max-md:py-24 max-md:max-w-full">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b65a34f6f1bd855ee119082b193df53343668ef8bc1ba1a0732a6c3a96a693be?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973"
          alt=""
          className="object-cover absolute inset-0 size-full"
        />
        <div className="flex relative flex-wrap gap-5 justify-between py-8 pr-10 pl-20 mb-0 max-w-full bg-white rounded-xl shadow-[124px_100px_45px_rgba(0,0,0,0)] w-[1236px] max-md:px-5 max-md:mb-2.5">
          <form className="flex flex-col max-md:max-w-full">
            <h1 className="self-start text-4xl font-bold text-neutral-800">
              Lisa kass
            </h1>
            {inputFields.map((field, index) => (
              <InputField key={index} {...field} />
            ))}
            <div className="flex gap-7 self-start mt-8 text-neutral-800">
              <input
                type="checkbox"
                id="terms"
                className="shrink-0 self-start border border-solid border-neutral-600 h-[18px] w-[18px]"
              />
              <label htmlFor="terms" className="basis-auto">
                I agree to all terms
              </label>
            </div>
            <button
              type="submit"
              className="self-start px-8 py-5 mt-5 whitespace-nowrap bg-teal-300 rounded-md text-slate-50 max-md:px-5"
            >
              Register
            </button>
            <p className="self-start mt-5 text-neutral-800">
              Already have an account?{" "}
              <a href="#" className="text-sky-600">
                Sign In
              </a>
            </p>
          </form>
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/400f90768edcd75a4d0044138d419a7f8a8a13e746f088c5e23268000273a55b?placeholderIfAbsent=true&apiKey=a6209b244aa54c4e8f2b191433bea973"
            alt=""
            className="object-contain shrink-0 self-end mt-96 max-w-full aspect-[0.58] shadow-[16px_16px_4px_rgba(0,0,0,0.25)] w-[178px] max-md:mt-10"
          />
        </div>
      </section>
    </main>
  );
};

export default RegisterForm;
