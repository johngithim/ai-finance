"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema } from "../lib/schema";
import useFetch from "../hooks/UseFetch";
import { createTransaction } from "../actions/Transaction";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";

const AddTransactionForm = ({ accounts, categories }) => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      amount: "",
      description: "",
      accountId: accounts.find((ac) => ac.isDefault)?.id,
      date: new Date(),
      isRecurring: false,
    },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(createTransaction);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");
  return (
    <form className={"space-y-6"}>
      {/*AI recipt*/}
      <div className={"space-y-2"}>
        <label className={"text-sm font-medium"}>Type</label>
        <Select
          onValueChange={(value) => setValue("type", value)}
          defaultValue={type}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>

        {errors.type && (
          <p className={"text-sm text-red-500"}>{errors.type.message}</p>
        )}
      </div>

      <div>
        <div className={"space-y-2"}>
          <label className={"text-sm font-medium"}>Amount</label>
          <Input
            type={"number"}
            step={"0.01"}
            placeholder={"0.00"}
            {...register("amount")}
          />

          {errors.type && (
            <p className={"text-sm text-red-500"}>{errors.type.message}</p>
          )}
        </div>

        <div className={"space-y-2"}>
          <label className={"text-sm font-medium"}>Account</label>
          <Select
            onValueChange={(value) => setValue("accountId", value)}
            defaultValue={getValues("accountId")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} (${parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.type && (
            <p className={"text-sm text-red-500"}>{errors.type.message}</p>
          )}
        </div>
      </div>
    </form>
  );
};
export default AddTransactionForm;
