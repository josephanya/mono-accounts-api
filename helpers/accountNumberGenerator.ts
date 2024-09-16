import Account from "../models/accounts.model";

const generateUniqueAccountNumber = async () => {
  let accountNumber = '';
  let isUnique = false;

  while (!isUnique) {
    accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const existingAccount = await Account.findOne({ account_number: accountNumber });
    if (!existingAccount) {
      isUnique = true;
    }
  }
  return accountNumber;
}

export default generateUniqueAccountNumber;