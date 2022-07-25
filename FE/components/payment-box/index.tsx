import React from "react";
import styles from "./payment-box.module.css";
import Button, { ButtonType } from "@/atomics/button";
import { useForm } from "react-hook-form";
import usePayment from "@/hooks/payment";

export default function PaymentBox() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { book, onCreateOrder } = usePayment();
  const handleBuy = (data: any) => {
    onCreateOrder(data.name, data.phone);
    // router.push("/order-created");
  };
  return (
    <div className={styles["payment-box-container"]}>
      <div className="w-11/12 px-8 py-20 m-auto max-w-450">
        <div>Selected:</div>
        <div className="flex justify-between">
          <div>{book?.name}</div>
          <div>${book?.price}</div>
        </div>
        <form
          onSubmit={handleSubmit((data) => {
            handleBuy(data);
          })}
          className="p-0"
        >
          <div className="w-full px-4 py-8 m-auto my-10 border border-solid rounded-lg max-w-450">
            <span>Customer name: &nbsp;</span>
            <input
              className="w-48 app-input"
              {...register("name", { required: true })}
            />
            {errors.name && (
              <div className="text-xs text-red-500">This field is required</div>
            )}
          </div>
          <div className="w-full px-4 py-8 m-auto my-10 border border-solid rounded-lg max-w-450">
            <span>Phone number: &nbsp;</span>
            <input
              className="w-48 app-input"
              {...register("phone", {
                required: true,
                maxLength: 12,
                pattern:
                  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
              })}
            />
            {errors.phone && (
              <div className="text-xs text-red-500">
                {/* @ts-ignore */}
                {errors.phone?.type === "required"
                  ? "This field is required"
                  : "Enter a valid phone number"}
              </div>
            )}
          </div>
          <div className="text-center">
            <Button
              type={ButtonType.SUBMIT}
              className="h-10 px-10 m-auto rounded-sm hover:bg-slate-100"
            >
              Buy
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
