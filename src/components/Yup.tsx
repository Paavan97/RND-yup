import React from "react";
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  FieldValues,
  UseFormGetValues,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  education: yup.string(),
  dob: yup.string().required("DOB is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  projects: yup
    .array()
    .of(
      yup.object().shape({
        projectName: yup.string().required("Project Name is required"),
        projectDescription: yup
          .string()
          .required("Project Description is required"),
      })
    )
    .min(1, "At least one project is required"),
  cvType: yup.string().required("CV Type is required"),
  websiteLink: yup.string().transform((originalValue, originalObject) => {
    if (originalObject.cvType === "online") {
      return yup
        .string()
        .url("Invalid website link")
        .required("Website Link is required")
        .validate(originalValue);
    }
    return originalValue;
  }),

  file: yup.mixed().transform((originalValue, originalObject) => {
    if (originalObject.cvType === "offline") {
      return yup
        .mixed()
        .test(
          "fileFormat",
          "Invalid file format",
          (value) =>
            value &&
            ["application/pdf", "application/msword"].includes(
              (value as File).type
            )
        )
        .required("File is required")
        .validate(originalValue);
    }
    return originalValue;
  }),
  degreeType: yup.array().of(yup.string()),
  address: yup.string(),
  mobileNumber: yup
    .string()
    .matches(/^\d{10}$/, "Invalid mobile number")
    .required("Mobile number is required"),
  pinCode: yup.string().matches(/^\d{6}$/, "Invalid pin code"),
  emergencyNumber: yup.string(),
  profilePhoto: yup.string().required("Profile Photo is required"),
  coverPhoto: yup.string(),
  experience: yup
    .number()
    .required("Years of experience is required")
    .min(0)
    .max(10),
  skills: yup
    .array()
    .of(yup.string())
    .required("At least one skill is required"),
  aboutMe: yup
    .string()
    .max(250, "Description should be at most 250 characters")
    .required("Description is required"),
  agreeTerms: yup
    .boolean()
    .oneOf([true], "You must agree to the terms and conditions"),
});

interface FormData {
  firstName: string;
  lastName: string;
  education?: string;
  dob: string;
  email: string;
  projects: { projectName: string; projectDescription: string }[];
  cvType: string;
  websiteLink?: string;
  file?: FileList;
  degreeType?: string[];
  address?: string;
  mobileNumber: string;
  pinCode?: string;
  emergencyNumber?: string;
  profilePhoto: string;
  coverPhoto?: string;
  experience: number;
  skills: string[];
  aboutMe: string;
  agreeTerms: boolean;
}

const Yup: React.FC = () => {
  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "projects",
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  // function watch(arg0: string) {
  //   throw new Error("Function not implemented.");
  // }

  // function getValues(arg0: string) {
  //   throw new Error("Function not implemented.");
  // }

  return (
    <>
      <h1 className="text-orange-700 text-4xl">
        React Form Validation Using React Hook Form and Yup
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-2xl mx-auto mt-8 p-4 bg-gray-200 rounded"
      >
        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-600"
          >
            First Name
          </label>
          <input
            type="text"
            {...register("firstName")}
            className="mt-1 p-2 w-full border rounded-md"
          />
          <p className="text-red-500 text-xs italic">
            {errors.firstName?.message}
          </p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-600"
          >
            Last Name
          </label>
          <input
            type="text"
            {...register("lastName")}
            className="mt-1 p-2 w-full border rounded-md"
          />
          <p className="text-red-500 text-xs italic">
            {errors.lastName?.message}
          </p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="education"
            className="block text-sm font-medium text-gray-600"
          >
            Education
          </label>
          <input
            type="text"
            {...register("education")}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="dob"
            className="block text-sm font-medium text-gray-600"
          >
            DOB
          </label>
          <input
            type="text"
            {...register("dob")}
            className="mt-1 p-2 w-full border rounded-md"
          />
          <p className="text-red-500 text-xs italic">{errors.dob?.message}</p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600"
          >
            Email
          </label>
          <input
            type="text"
            {...register("email")}
            className="mt-1 p-2 w-full border rounded-md"
          />
          <p className="text-red-500 text-xs italic">{errors.email?.message}</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Projects
          </label>
          {fields.map((project, index) => (
            <div key={project.id} className="mb-4">
              <label className="block text-sm font-medium text-gray-600">
                Project Name
              </label>
              <input
                type="text"
                {...register(`projects.${index}.projectName` as const)}
                defaultValue={project.projectName}
                className="mt-1 p-2 w-full border rounded-md"
              />
              <p className="text-red-500 text-xs italic">
                {errors.projects?.[index]?.projectName?.message}
              </p>

              <label className="block text-sm font-medium text-gray-600 mt-4">
                Project Description
              </label>
              <input
                type="text"
                {...register(`projects.${index}.projectDescription` as const)}
                defaultValue={project.projectDescription}
                className="mt-1 p-2 w-full border rounded-md"
              />
              <p className="text-red-500 text-xs italic">
                {errors.projects?.[index]?.projectDescription?.message}
              </p>

              <button
                type="button"
                onClick={() => remove(index)}
                className="bg-red-500 text-white p-2 rounded mt-4"
              >
                Remove Project
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ projectName: "", projectDescription: "" })}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Add Project
          </button>
          <p className="text-red-500 text-xs italic">
            {errors.projects?.message}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            CV Type
          </label>
          <div>
            <label>
              <input
                type="radio"
                {...register("cvType")}
                value="online"
                className="mr-2"
              />
              Online
            </label>
            <label className="ml-4">
              <input
                type="radio"
                {...register("cvType")}
                value="offline"
                className="mr-2"
              />
              Offline
            </label>
          </div>
          <p className="text-red-500 text-xs italic">
            {errors.cvType?.message}
          </p>
        </div>

        {watch("cvType") === "online" ? (
  <div className="mb-4">
    <label
      htmlFor="websiteLink"
      className="block text-sm font-medium text-gray-600"
    >
      Website Link
    </label>
    <input
      type="text"
      {...register("websiteLink")}
      className="mt-1 p-2 w-full border rounded-md"
    />
    <p className="text-red-500 text-xs italic">
      {errors.websiteLink?.message}
    </p>
  </div>
) : (
  <div className="mb-4">
    <label
      htmlFor="file"
      className="block text-sm font-medium text-gray-600"
    >
      Upload File (PDF or DOC)
    </label>
    <input
      type="file"
      {...register("file")}
      className="mt-1 p-2 w-full border rounded-md"
    />
    <p className="text-red-500 text-xs italic">
      {errors.file?.message}
    </p>
  </div>
)}


        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Degree Type
          </label>
          <div>
            <label>
              <input
                type="checkbox"
                {...register("degreeType")}
                value="Engineering"
                className="mr-2"
              />
              Engineering
            </label>
            <label className="ml-4">
              <input
                type="checkbox"
                {...register("degreeType")}
                value="BCA"
                className="mr-2"
              />
              BCA
            </label>
            <label className="ml-4">
              <input
                type="checkbox"
                {...register("degreeType")}
                value="MCA"
                className="mr-2"
              />
              MCA
            </label>
            <label className="ml-4">
              <input
                type="checkbox"
                {...register("degreeType")}
                value="other"
                className="mr-2"
              />
              Other
            </label>
          </div>
          <p className="text-red-500 text-xs italic">
            {errors.degreeType?.message}
          </p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-600"
          >
            Address
          </label>
          <input
            type="text"
            {...register("address")}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="mobileNumber"
            className="block text-sm font-medium text-gray-600"
          >
            Mobile Number
          </label>
          <input
            type="text"
            {...register("mobileNumber")}
            className="mt-1 p-2 w-full border rounded-md"
          />
          <p className="text-red-500 text-xs italic">
            {errors.mobileNumber?.message}
          </p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="pinCode"
            className="block text-sm font-medium text-gray-600"
          >
            Pin Code
          </label>
          <input
            type="text"
            {...register("pinCode")}
            className="mt-1 p-2 w-full border rounded-md"
          />
          <p className="text-red-500 text-xs italic">
            {errors.pinCode?.message}
          </p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="emergencyNumber"
            className="block text-sm font-medium text-gray-600"
          >
            Emergency Number
          </label>
          <input
            type="text"
            {...register("emergencyNumber")}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="profilePhoto"
            className="block text-sm font-medium text-gray-600"
          >
            Profile Photo
          </label>
          <input
            type="text"
            {...register("profilePhoto")}
            className="mt-1 p-2 w-full border rounded-md"
          />
          <p className="text-red-500 text-xs italic">
            {errors.profilePhoto?.message}
          </p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="coverPhoto"
            className="block text-sm font-medium text-gray-600"
          >
            Cover Photo
          </label>
          <input
            type="text"
            {...register("coverPhoto")}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="experience"
            className="block text-sm font-medium text-gray-600"
          >
            Years of Experience
          </label>
          <input
            type="text"
            {...register("experience")}
            className="mt-1 p-2 w-full border rounded-md"
          />
          <p className="text-red-500 text-xs italic">
            {errors.experience?.message}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Skills
          </label>
          <div>
            <label>
              <input
                type="checkbox"
                {...register("skills")}
                value="JS"
                className="mr-2"
              />
              JS
            </label>
            <label className="ml-4">
              <input
                type="checkbox"
                {...register("skills")}
                value="Python"
                className="mr-2"
              />
              Python
            </label>
            <label className="ml-4">
              <input
                type="checkbox"
                {...register("skills")}
                value="php"
                className="mr-2"
              />
              PHP
            </label>
          </div>
          <p className="text-red-500 text-xs italic">
            {errors.skills?.message}
          </p>
        </div>

        <div className="mb-4">
          <label
            htmlFor="aboutMe"
            className="block text-sm font-medium text-gray-600"
          >
            Description About Yourself
          </label>
          <textarea
            {...register("aboutMe")}
            className="mt-1 p-2 w-full border rounded-md"
          />
          <p className="text-red-500 text-xs italic">
            {errors.aboutMe?.message}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            I Agree to Terms and Conditions
          </label>
          <input type="checkbox" {...register("agreeTerms")} className="mr-2" />
          <p className="text-red-500 text-xs italic">
            {errors.agreeTerms?.message}
          </p>
        </div>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit
        </button>
      </form>
    </>
  );
};

export default Yup;
