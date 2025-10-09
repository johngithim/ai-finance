import { getUserAccounts } from "../../../../actions/Dashboard";
import { defaultCategories } from "../../../../data/categories";
import AddTransactionForm from "../../../../components/AddTransactionForm";
import { getTransaction } from "../../../../actions/Transaction";

const Page = async ({ searchParams }) => {
  const accounts = await getUserAccounts();
  const editId = searchParams?.edit;

  let initialData = null;

  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className={"max-w-3xl mx-auto px-5"}>
      <h1 className={"text-5xl gradient-title mb-8"}>
        {editId ? "Edit" : "Add"} Transactions
      </h1>
      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  );
};
export default Page;
