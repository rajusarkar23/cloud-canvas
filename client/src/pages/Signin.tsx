import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCloudCanvasUserStore } from "@/store/user_store";

interface FormFields {
  email: string;
  password: string;
}

export default function Signin() {
  const { signin } = useCloudCanvasUserStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const navigate = useNavigate();

  const onsubmit: SubmitHandler<FormFields> = async (data) => {
    await signin({ email: data.email, password: data.password });
    // if user is authenticated
    if (useCloudCanvasUserStore.getState().isUserAuthenticated) {
      navigate(`/dashboard/${useCloudCanvasUserStore.getState().userName}`);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onsubmit)}
      className="px-4 flex items-center min-h-[90vh] flex-col justify-center space-y-4 mx-auto max-w-sm"
    >
      <div>
        <h2 className="text-2xl font-bold">Signup</h2>
      </div>

      <div className="w-full">
        <label htmlFor="Email">Email</label>
        <Input
          {...register("email", {
            required: { value: true, message: "Email is required." },
          })}
          type="email"
          placeholder="Email"
        />
        {errors.email && <p>{errors.email.message}</p>}

        <label htmlFor="Password">Password</label>
        <Input
          {...register("password", {
            required: { value: true, message: "Password is required" },
            minLength: {
              value: 6,
              message: "Password should be minimun 6 char long.",
            },
          })}
          type="password"
          placeholder="Password"
        />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <div className="w-full">
        <Button className="w-full">Submit</Button>
      </div>

      <div>
        <Link
          to={"/signup"}
          className="text-blue-600 underline underline-offset-2"
        >
          Create account
        </Link>
      </div>
    </form>
  );
}
