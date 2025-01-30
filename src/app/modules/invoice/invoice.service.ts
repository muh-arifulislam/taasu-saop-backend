import { IInvoice } from './invoice.interface';
import { Invoice } from './invoice.model';

const addInvoiceIntoDB = async (payload: IInvoice) => {
  const result = await Invoice.create(payload);

  return result;
};

export const InvoiceServices = { addInvoiceIntoDB };
