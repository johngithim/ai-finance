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
import CreateAccountDrawer from "./CreateAccountDrawer";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "./ui/switch";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const AddTransactionForm = ({ accounts, categories }) => {
  const router = useRouter();
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

  const onSubmit = async (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };

    transactionFn(formData);
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast("Transaction created successfully!");
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
  }, [transactionResult, transactionLoading]);

  const filteredCategories = categories.filter(
    (category) => category.type === type,
  );
  return (
    <form className={"space-y-6"} onSubmit={handleSubmit(onSubmit)}>
      {/*AI recipt*/}
      <div className={"space-y-2"}>
        <label className={"text-sm font-medium w-full"}>Type</label>
        <Select
          onValueChange={(value) => setValue("type", value)}
          defaultValue={type}
        >
          <SelectTrigger className={"w-full"}>
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

      <div className={"grid gap-4 md:grid-cols-2"}>
        <div className={"space-y-2"}>
          <label className={"text-sm font-medium"}>Amount</label>
          <Input
            type={"number"}
            step={"0.01"}
            placeholder={"0.00"}
            {...register("amount")}
          />

          {errors.amount && (
            <p className={"text-sm text-red-500"}>{errors.amount.message}</p>
          )}
        </div>

        <div className={"space-y-2"}>
          <label className={"text-sm font-medium"}>Account</label>
          <Select
            onValueChange={(value) => setValue("accountId", value)}
            defaultValue={getValues("accountId")}
          >
            <SelectTrigger className={"w-full"}>
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

          {errors.accountId && (
            <p className={"text-sm text-red-500"}>{errors.accountId.message}</p>
          )}
        </div>
      </div>

      <div className={"space-y-2"}>
        <label className={"text-sm font-medium"}>Category</label>
        <Select
          onValueChange={(value) => setValue("category", value)}
          defaultValue={getValues("category")}
        >
          <SelectTrigger className={"w-full"}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.category && (
          <p className={"text-sm text-red-500"}>{errors.category.message}</p>
        )}
      </div>

      <div className={"space-y-2"}>
        <label className={"text-sm font-medium"}>Date</label>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={"w-full pl-3 text-left font-normal"}
            >
              {" "}
              {date ? format(date, "ppp") : <span>Pick a date</span>}
              <CalendarIcon className={"ml-auto h-4 w-4 opacity-50"} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className={"w-auto p-0"} align={"start"}>
            <Calendar
              mode={"single"}
              selceted={date}
              onSelect={(date) => setValue("date", date)}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {errors.date && (
          <p className={"text-sm text-red-500"}>{errors.date.message}</p>
        )}
      </div>

      <div className={"space-y-2"}>
        <label className={"text-sm font-medium"}>Description</label>
        <Input placeholder={"Enter description"} {...register("description")} />

        {errors.description && (
          <p className={"text-sm text-red-500"}>{errors.description.message}</p>
        )}
      </div>
      <div
        className={"flex items-center justify-between rounded-lg border p-3"}
      >
        <div className={"space-y-0.5"}>
          <label
            htmlFor="isDefault"
            className={"text-sm font-medium cursor-pointer"}
          >
            Recurring Transaction
          </label>
          <p className={"text-gray-600 text-sm text-muted-foreground"}>
            Setup a recurring schedule for this transaction.
          </p>
        </div>
        <Switch
          onCheckedChange={(checked) => setValue("isRecurring", checked)}
          checked={isRecurring}
        />
      </div>

      {isRecurring && (
        <div className={"space-y-2"}>
          <label className={"text-sm font-medium"}>Recurring Interval</label>
          <Select
            onValueChange={(value) => setValue("recurringInterval", value)}
            defaultValue={getValues("recurringInterval")}
          >
            <SelectTrigger className={"w-full"}>
              <SelectValue placeholder="Select Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"DAILY"}>Daily</SelectItem>
              <SelectItem value={"DAILY"}>Weekly</SelectItem>
              <SelectItem value={"DAILY"}>Monthly</SelectItem>
              <SelectItem value={"DAILY"}>Yearly</SelectItem>
            </SelectContent>
          </Select>

          {errors.recurringInterval && (
            <p className={"text-sm text-red-500"}>
              {errors.recurringInterval.message}
            </p>
          )}
        </div>
      )}

      <div className={"flex gap-4"}>
        <Button
          type={"button"}
          variant={"outline"}
          // className={"w-full"}
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type={"submit"}
          // className={"w-full"}
          disabled={transactionLoading}
        >
          Create transaction
        </Button>
      </div>
    </form>
  );
};
export default AddTransactionForm;
