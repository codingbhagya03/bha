import { useState } from "react";
import { useForm, } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { app } from "./config"; // Fixed Import



const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  terms: yup.boolean().oneOf([true], "You must accept the Terms & Privacy Policy"),
});

type FormData = yup.InferType<typeof schema>;

export const App = () => {  // Renamed to Register if this is a separate file
  const {
    register,
    handleSubmit,
    reset,
   
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      terms: false,
    },
  });

 
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  console.log("working");
  const onSubmit = async (data: FormData) => {
    console.log("working");
    setIsLoading(true);
    setErrorMsg("");

    console.log("Signup Data:", data);

    const auth = getAuth(app);
    const db = getDatabase(app);

    createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await set(ref(db, `users/${user.uid}`), {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          createdAt: new Date().toISOString(),
        });

        toast.success("User successfully signed up");
        reset();
      })
      .catch((error) => {
        console.error("Signup Error:", error);
        setErrorMsg(error.message || "Failed to create account. Please try again later.");
        toast.error(error.message || "Signup failed");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-semibold">Create Account</h1>
          <p className="text-sm text-gray-600">
            Already have an account? {" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Sign in
            </a>
          </p>
        </div>

        {errorMsg && <p className="text-red-500 text-center mt-4">{errorMsg}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-700">First Name</label>
              <input type="text" placeholder="First Name" {...register("firstName")} />
              <p className="text-red-500 text-xs">{errors.firstName?.message}</p>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-gray-700">Last Name</label>
              <input type="text" placeholder="Last Name" {...register("lastName")} />
              <p className="text-red-500 text-xs">{errors.lastName?.message}</p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-700">Email address</label>
            <input type="email" placeholder="Enter your email" {...register("email")} />
            <p className="text-red-500 text-xs">{errors.email?.message}</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm text-gray-700">Password</label>
            <input type="password" placeholder="Create a password" {...register("password")} />
            <p className="text-red-500 text-xs">{errors.password?.message}</p>
          </div>

          <div className="flex items-center space-x-2">
  <input type="checkbox" {...register("terms")} />
  <label>I agree to the Terms & Privacy Policy</label>
</div>

          <p className="text-red-500 text-xs">{errors.terms?.message}</p>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
