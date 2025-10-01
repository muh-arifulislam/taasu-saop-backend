import { IInvoice } from './invoice.interface';
import { Invoice } from './invoice.model';

const addInvoiceIntoDB = async (payload: IInvoice) => {
  const result = await Invoice.create(payload);

  return result;
};

const updateInvoiceIntoDB = async (id: string, payload: Partial<IInvoice>) => {
  const result = await Invoice.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const InvoiceServices = { addInvoiceIntoDB, updateInvoiceIntoDB };
