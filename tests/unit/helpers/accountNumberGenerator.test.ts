import Account from '../../../models/accounts.model';
import accountNumberGenerator from '../../../helpers/accountNumberGenerator';

jest.mock('../../../models/accounts.model');

describe('generate unique account number', () => {
    it('should generate a unique 10-digit account number', async () => {
        (Account.findOne as jest.Mock).mockImplementationOnce(() => null);
        const accountNumber = await accountNumberGenerator();
        expect(accountNumber).toHaveLength(10);
    });

    it('should retry generating an account number if a duplicate is found', async () => {
        (Account.findOne as jest.Mock)
            .mockImplementationOnce(() => ({ account_number: '1234567890' }))
            .mockImplementationOnce(() => null);

        const accountNumber = await accountNumberGenerator();
        expect(accountNumber).toHaveLength(10);
        expect(Account.findOne).toHaveBeenCalledTimes(3);
    });
});
