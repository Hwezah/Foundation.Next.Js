"use client";
import "@/app/_styles/globals.css";
import { useState } from "react";
import Button from "./Button";
import { useForm } from "react-hook-form";
import SelectCountry from "../_components/SelectCountry";
import Image from "next/image";
// export const metadata = {
//   title: "Login / Foundation",
// };
export default function Page() {
  const countryFlag = "pt.jpg";
  const nationality = "portugal";
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  function onSubmit(data) {
    // 👉 Add your API call here
    console.log(data);
    setSubmitted(true);
  }

  return (
    <>
      <div className="mx-auto max-w-3xl mt-12">
        <h2 className="font-semibold text-2xl text-accent-400 mb-4">
          Update your guest profile
        </h2>

        <p className="text-lg mb-8 text-primary-200">
          Providing the following information will make your check-in process
          faster and smoother. See you soon!
        </p>
      </div>
      <div className="mx-auto max-w-3xl text-gray-100 bg-cyan-900  mt-12">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="py-8 px-12 text-lg flex gap-6 flex-col "
        >
          <div className="space-y-2">
            <label>Full name</label>
            <input
              {...register("Full name", { required: true })}
              className="px-5 py-3 bg-gray-100 focus:outline-none text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <label>Email address</label>
            <input
              {...register("Email address", { required: true })}
              className="px-5 py-3 bg-gray-100 focus:outline-none text-primary-800 w-full shadow-sm rounded-sm disabled:cursor-not-allowed disabled:bg-gray-600 disabled:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between relative">
              <label htmlFor="nationality">Where are you from?</label>
              <Image
                full
                src={countryFlag}
                alt="Country flag"
                className="h-5 rounded-sm object-cover"
              />
            </div>

            <SelectCountry
              name="nationality"
              id="nationality"
              className="px-5 py-4 bg-cyan-800 text-primary-800 w-full shadow-sm rounded-sm"
              defaultCountry={nationality}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="nationalID">National ID number</label>
            <input
              {...register("nationalID", { required: true })}
              name="nationalID"
              className="px-5 py-3 bg-cyan-800 text-primary-800 w-full shadow-sm rounded-sm focus:outline-none"
            />
          </div>

          <div className="flex justify-end items-center gap-6">
            <Button className=" px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300">
              Update profile
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
